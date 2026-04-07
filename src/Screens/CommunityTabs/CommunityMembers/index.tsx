import React, { useState } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import styles from './style';
import MemberItem from './Components/MemberItem';
import PendingMemberItem from './Components/PendingMemberItem';
import FilterTabs from './Components/FilterTabs';
import Modal from 'react-native-modal';
import SearchBar from '@/Components/Core/SearchBar';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { MEMBER_FILTER_TABS } from '@/Constants/customData';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import CommunityMembersSkeleton from '@/Components/Core/Skeleton/CommunityMembersSkeleton';
import { ApiEndPoints } from '@/ApiService/api-end-points';
import { Config } from '@/Config';
import { Share, Alert, Linking, Platform, NativeModules } from 'react-native';

// Simple Base64 helper for fallback sharing
const toBase64 = (str: string) => {
  try {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let encoded = '';
    let i = 0;
    const utf8 = unescape(encodeURIComponent(str));
    while (i < utf8.length) {
      const byte1 = utf8.charCodeAt(i++) & 0xff;
      const byte2 = i < utf8.length ? utf8.charCodeAt(i++) & 0xff : NaN;
      const byte3 = i < utf8.length ? utf8.charCodeAt(i++) & 0xff : NaN;
      const enc1 = byte1 >> 2;
      const enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
      let enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
      let enc4 = byte3 & 63;
      if (isNaN(byte2)) enc3 = enc4 = 64;
      else if (isNaN(byte3)) enc4 = 64;
      encoded +=
        chars.charAt(enc1) +
        chars.charAt(enc2) +
        chars.charAt(enc3) +
        chars.charAt(enc4);
    }
    return encoded;
  } catch (e) {
    return '';
  }
};

interface Props {
  communityId?: string;
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunityMembers = ({
  communityId,
  onScroll,
  scrollEventThrottle,
}: Props) => {
  const {
    getCommunityMembers,
    apiGetCommunityMembersLoading,
    exportCommunityMembers,
    getCommunityAccessRequests,
    apiGetCommunityAccessRequestsLoading,
    approveAccessRequest,
    apiApproveAccessRequestLoading,
    rejectAccessRequest,
    apiRejectAccessRequestLoading,
    apiExportCommunityMembersLoading,
    updateMemberStatus,
    apiUpdateMemberStatusLoading,
    userToken,
  } = useUserApi();

  const [activeTab, setActiveTab] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'accept' | 'reject' | 'deactivate' | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDeactivateModalVisible, setIsDeactivateModalVisible] = useState(false);
  const [selectedMemberForDeactivation, setSelectedMemberForDeactivation] = useState<any>(null);
  const [deactivationReason, setDeactivationReason] = useState('');

  const limit = 12;

  const fetchMembers = async (
    pageNum: number,
    statusFilter: string,
    search: string,
    isRefresh: boolean = false,
  ) => {
    if (!communityId) return;

    let query = `?page=${pageNum}&limit=${limit}`;
    if (statusFilter === 'Subscribers') {
      query += `&subscriptionStatus=subscribed`;
    } else if (statusFilter === 'Pending Approval') {
      // Handled by different API call
    } else if (statusFilter !== 'All') {
      query += `&status=${statusFilter.toLowerCase()}`;
    }
    if (search) {
      query += `&search=${search}`;
    }

    let res: any;
    if (statusFilter === 'Pending Approval') {
      res = await getCommunityAccessRequests(communityId, query);
      // Map access requests to member format
      if (res?.success && res?.data?.requests) {
        res.data.members = res.data.requests.map((req: any) => ({
          ...req.userId,
          _id: req._id,
          joinedAt: req.createdAt,
          message: req.message,
          status: 'Pending',
          role: 'Subscriber',
          subscriptionPlan: req.plan?.name || 'Free',
          isSubscribed: false,
        }));
      }
    } else {
      res = await getCommunityMembers(communityId, query);
    }

    if (res?.success) {
      if (isRefresh || pageNum === 1) {
        setMembers(res?.data?.members || []);
      } else {
        setMembers(prev => [...prev, ...(res?.data?.members || [])]);
      }
      setPagination(res?.data?.pagination);
    }
    setInitialLoading(false);
  };

  // Unified effect for fetching members on filter/search change
  React.useEffect(() => {
    setInitialLoading(true);
    const timer = setTimeout(() => {
      fetchMembers(1, activeTab, searchText, true);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [communityId, activeTab, searchText]);

  const handleApprove = (item: any) => {
    setSelectedRequest(item);
    setConfirmAction('accept');
    setIsConfirmModalVisible(true);
  };

  const handleReject = (item: any) => {
    setSelectedRequest(item);
    setConfirmAction('reject');
    setIsConfirmModalVisible(true);
  };

  const handleDeactivatePress = (item: any) => {
    setSelectedMemberForDeactivation(item);
    setDeactivationReason('');
    setIsDeactivateModalVisible(true);
  };

  const handleConfirmDeactivation = async () => {
    if (!communityId || !selectedMemberForDeactivation) return;

    const body = {
      deactivationReason: deactivationReason,
      status: 'inactive',
    };

    const res = await updateMemberStatus(
      communityId,
      selectedMemberForDeactivation._id,
      body,
    );

    if (res?.success) {
      setMembers(prev =>
        prev.filter(m => m._id !== selectedMemberForDeactivation._id),
      );
      setIsDeactivateModalVisible(false);
      setSelectedMemberForDeactivation(null);
      setDeactivationReason('');
    }
  };

  const executeAction = async () => {
    if (!communityId || !selectedRequest || !confirmAction) return;

    const requestId = selectedRequest._id;
    setIsConfirmModalVisible(false);
    setProcessingId(requestId);

    const res =
      confirmAction === 'accept'
        ? await approveAccessRequest(communityId, requestId)
        : await rejectAccessRequest(communityId, requestId);

    if (res?.success) {
      setMembers(prev => prev.filter(m => m._id !== requestId));
    }
    setProcessingId(null);
    setSelectedRequest(null);
    setConfirmAction(null);
  };

  const handleLoadMore = () => {
    if (
      !apiGetCommunityMembersLoading &&
      pagination &&
      page < pagination.totalPages
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMembers(nextPage, activeTab, searchText);
    }
  };

  const handleExportCSV = async () => {
    if (!communityId) return;

    let query = '';
    if (activeTab === 'Subscribers') {
      query = '?subscriptionStatus=subscribed';
    } else if (activeTab !== 'All') {
      query = `?status=${activeTab.toLowerCase()}`;
    }

    try {
      // 1. First fetch the data using the authorized API (which has the Bearer token)
      const res = await exportCommunityMembers(communityId, query);

      // Handle both raw string and object response
      const csvData = res?.data || (typeof res === 'string' ? res : null);

      if (!csvData) {
        Alert.alert('No Data', 'No member data available to export.');
        return;
      }

      const content =
        typeof csvData === 'string' ? csvData : JSON.stringify(csvData);
      const fileName = `Members_${activeTab}_${new Date().getTime()}.csv`;

      // Defensive check: Only try to use the library if the native module is actually linked/present
      const isBlobUtilNativePresent =
        !!NativeModules.ReactNativeBlobUtil || !!NativeModules.BlobUtil;

      if (
        (Platform.OS === 'android' || Platform.OS === 'ios') &&
        isBlobUtilNativePresent
      ) {
        try {
          const ReactNativeBlobUtil =
            require('react-native-blob-util').default ||
            require('react-native-blob-util');
          if (ReactNativeBlobUtil && ReactNativeBlobUtil.fs) {
            const { dirs } = ReactNativeBlobUtil.fs;

            if (Platform.OS === 'android') {
              const path = `${dirs.DownloadDir}/${fileName}`;

              // 1. Write the file
              await ReactNativeBlobUtil.fs.writeFile(path, content, 'utf8');

              // 2. Register with Download Manager (Crucial for visibility)
              if (
                ReactNativeBlobUtil.android &&
                ReactNativeBlobUtil.android.addCompleteDownload
              ) {
                await ReactNativeBlobUtil.android.addCompleteDownload({
                  title: fileName,
                  description: 'Community Members Export',
                  mime: 'text/csv',
                  path: path,
                  showNotification: true,
                });
              }

              // 3. Scan file to ensure it's indexed
              if (ReactNativeBlobUtil.fs.scanFile) {
                await ReactNativeBlobUtil.fs.scanFile([
                  { path, mime: 'text/csv' },
                ]);
              }

              Alert.alert(
                'Download Complete',
                `File saved to Downloads folder as:\n${fileName}`,
                [
                  {
                    text: 'Open File',
                    onPress: async () => {
                      try {
                        await ReactNativeBlobUtil.android.actionViewIntent(
                          path,
                          'text/csv',
                        );
                      } catch (err) {
                        Alert.alert(
                          'No CSV Viewer',
                          'The file is in your Downloads folder, but no app was found to open it. You can open it manually using Excel or Sheets.',
                        );
                      }
                    },
                  },
                  { text: 'OK' },
                ],
              );
            } else {
              // iOS Implementation (Remains the same as it was working)
              const path = `${dirs.DocumentDir}/${fileName}`;
              await ReactNativeBlobUtil.fs.writeFile(path, content, 'utf8');

              if (
                ReactNativeBlobUtil.ios &&
                ReactNativeBlobUtil.ios.openDocument
              ) {
                ReactNativeBlobUtil.ios.openDocument(path);
              } else {
                throw new Error('openDocument not available');
              }
            }
            return;
          }
        } catch (e) {
          console.log(
            'react-native-blob-util execution failed (expected if not rebuilt), falling back to Share',
            e,
          );
        }
      }

      // Fallback: Share API
      const base64 = toBase64(content);
      const dataUri = `data:application/csv;base64,${base64}`;
      await Share.share({
        url: dataUri,
        title: fileName,
      });
    } catch (error) {
      console.error('Export Error:', error);
      Alert.alert(
        'Export Failed',
        'An error occurred while trying to export the file.',
      );
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Members</Text>
      </View>
      <FilterTabs
        tabs={MEMBER_FILTER_TABS}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
      <View style={styles.searchRow}>
        <View style={styles.searchBarContainer}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            // placeholder="Search user by name or email..."
          />
        </View>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={handleExportCSV}
          disabled={apiExportCommunityMembersLoading}
        >
          {apiExportCommunityMembersLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Icon name="Download" size={18} color={COLORS.white} />
              <Text style={styles.exportText}>Export CSV</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => {
    const isLoading =
      (apiGetCommunityMembersLoading ||
        apiGetCommunityAccessRequestsLoading ||
        initialLoading) &&
      page === 1;

    if (isLoading) {
      return <CommunityMembersSkeleton />;
    }

    const tabLabel = activeTab === 'All' ? '' : ` ${activeTab}`;
    const title = `No${tabLabel} Members`;
    const subtitle = `There are no${tabLabel.toLowerCase()} members in this community.`;

    return (
      <View style={styles.emptyStateCard}>
        <Icon name="Hourglass" size={60} color={COLORS.placeholder} />
        <Text style={styles.emptyStateTitle}>{title}</Text>
        <Text style={styles.emptyStateSubtitle}>{subtitle}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        data={
          (apiGetCommunityMembersLoading ||
            apiGetCommunityAccessRequestsLoading ||
            initialLoading) &&
            page === 1
            ? []
            : members
        }
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => {
          if (activeTab === 'Pending Approval') {
            return (
              <PendingMemberItem
                name={`${item.firstName} ${item.lastName}`}
                email={item.email}
                message={item.message}
                date={new Date(item.joinedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                onAccept={() => handleApprove(item)}
                onReject={() => handleReject(item)}
                isAccepting={
                  processingId === item._id && apiApproveAccessRequestLoading
                }
                isRejecting={
                  processingId === item._id && apiRejectAccessRequestLoading
                }
              />
            );
          }
          return (
            <MemberItem
              name={`${item.firstName} ${item.lastName}`}
              email={item.email}
              joinedDate={new Date(item.joinedAt).toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
              status={item.status}
              role={item.role === 'member' ? 'Subscriber' : 'Owner'}
              type={item.subscriptionPlan ? 'Paid' : 'Free'}
              isSubscribed={item.isSubscribed}
              plan={item.subscriptionPlan}
              onBlockPress={() => handleDeactivatePress(item)}
            />
          );
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyState()}
        ListFooterComponent={
          apiGetCommunityMembersLoading && page > 1 ? (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={{ marginVertical: 20 }}
            />
          ) : null
        }
        style={styles.animatedScroll}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader()}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        isVisible={isConfirmModalVisible}
        onBackdropPress={() => setIsConfirmModalVisible(false)}
        onSwipeComplete={() => setIsConfirmModalVisible(false)}
        swipeDirection="down"
        style={styles.modalContainer}
        avoidKeyboard
      >
        <View style={styles.mainModalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {confirmAction === 'accept' ? 'Accept Request' : 'Reject Request'}
            </Text>
            <TouchableOpacity onPress={() => setIsConfirmModalVisible(false)}>
              <Icon name="X" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalMessage}>
              Are you sure you want to {confirmAction}{' '}
              <Text style={styles.boldName}>
                {selectedRequest?.firstName} {selectedRequest?.lastName}
              </Text>'s join request?
              {confirmAction === 'reject' && ' This action cannot be undone.'}
            </Text>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={() => setIsConfirmModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalActionButton,
                confirmAction === 'reject' && styles.modalRejectButton,
              ]}
              onPress={executeAction}
            >
              <Text style={styles.modalActionText}>
                {confirmAction === 'accept' ? 'Accept' : 'Reject'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Deactivate User Modal */}
      <Modal
        isVisible={isDeactivateModalVisible}
        onBackdropPress={() => setIsDeactivateModalVisible(false)}
        style={styles.modalContainer}
        avoidKeyboard
      >
        <View style={styles.mainModalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Deactivate User</Text>
            <TouchableOpacity onPress={() => setIsDeactivateModalVisible(false)}>
              <Icon name="X" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalMessage}>
              Are you sure you want to deactivate{' '}
              <Text style={styles.boldName}>
                {selectedMemberForDeactivation?.firstName}{' '}
                {selectedMemberForDeactivation?.lastName}
              </Text>
              ?
            </Text>

            <TextInput
              style={styles.reasonInput}
              placeholder="Deactivation Reason"
              placeholderTextColor={COLORS.placeholder}
              multiline
              value={deactivationReason}
              onChangeText={setDeactivationReason}
            />
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={() => setIsDeactivateModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalActionButton, styles.orangeConfirmButton]}
              onPress={handleConfirmDeactivation}
              disabled={apiUpdateMemberStatusLoading}
            >
              {apiUpdateMemberStatusLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.modalActionText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CommunityMembers;
