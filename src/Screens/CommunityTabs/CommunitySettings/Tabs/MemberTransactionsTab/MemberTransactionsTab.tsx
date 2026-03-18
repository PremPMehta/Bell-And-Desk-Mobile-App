import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import Icon from '@/Components/Core/Icons';
import SearchBar from '@/Components/Core/SearchBar';
import styles from './style';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import Modal from 'react-native-modal';
import {
  StatsSkeleton,
  TransactionListSkeleton,
} from '@/Components/Core/Skeleton/MemberTransactionsSkeleton';
import {
  orderOptions,
  sortOptions,
  statusOptions,
} from '@/Constants/customData';

interface Props {
  slug?: string;
}

const MemberTransactionsTab = ({ slug }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isSortByModalVisible, setIsSortByModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const {
    getMemberTransactions,
    apiGetMemberTransactions,
    apiGetMemberTransactionsLoading,
  } = useUserApi();

  const formatPrice = (amount: any) => {
    const num = Number(amount) || 0;
    return (num / 100).toFixed(2);
  };

  // Debounce search query
  useEffect(() => {
    setInitialLoading(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchTransactions = async (pageNum: number, search: string) => {
    if (!slug) return;
    const query = `?page=${pageNum}&limit=10&sortBy=${sortBy}&sortOrder=${sortOrder}${
      status !== 'all' ? `&status=${status}` : ''
    }${search ? `&search=${search}` : ''}`;

    await getMemberTransactions(slug, query);
    setInitialLoading(false);
  };

  // Effect for initial load and filter changes
  useEffect(() => {
    setInitialLoading(true);
    setPage(1);
    fetchTransactions(1, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, status, sortBy, sortOrder]);

  // Effect for pagination
  useEffect(() => {
    if (page > 1) {
      fetchTransactions(page, debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const summary = apiGetMemberTransactions?.data?.summary || {};
  const transactions = apiGetMemberTransactions?.data?.transactions || [];

  const stats = [
    {
      title: 'Total Transactions',
      value: summary.totalTransactions || '0',
      icon: 'Users',
    },
    {
      title: 'Total Revenue',
      value: `$${formatPrice(summary.totalAmount)}`,
      icon: 'DollarSign',
    },
    {
      title: 'Net Amount',
      value: `$${formatPrice(summary.totalNetAmount)}`,
      icon: 'TrendingUp',
    },
    {
      title: 'Success Rate',
      value: `${
        summary.totalTransactions > 0
          ? (
              (summary.succeededTransactions / summary.totalTransactions) *
              100
            ).toFixed(0)
          : '0'
      }%`,
      icon: 'CircleCheck',
    },
  ];

  const renderStatsCard = (item: any, index: number) => {
    const marginStyle =
      index % 2 === 0 ? { marginRight: ms(6) } : { marginLeft: ms(6) };

    return (
      <View key={index} style={[styles.statsCard, marginStyle]}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsLabel}>{item.title}</Text>
          <View style={styles.statsIconContainer}>
            <Icon name={item.icon} size={ms(18)} color={COLORS.lightGray} />
          </View>
        </View>
        <Text style={styles.statsValue}>{item.value}</Text>
      </View>
    );
  };

  const renderTransactionItem = ({ item }: { item: any }) => {
    const student = item.student || {};
    const firstName = student.firstName || '';
    const lastName = student.lastName || '';
    const initials = firstName
      ? firstName.charAt(0).toUpperCase()
      : lastName
      ? lastName.charAt(0).toUpperCase()
      : '?';
    const profilePicture = student.profilePicture?.url;

    return (
      <View key={item.id || item._id} style={styles.tableRow}>
        <View style={styles.listTitleContainer}>
          <View style={styles.memberInfo}>
            <View style={styles.avatar}>
              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={styles.avatarImg}
                />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
            <View>
              <Text style={styles.memberName}>
                {`${firstName} ${lastName}`.trim()}
              </Text>
              <Text style={styles.memberEmail}>{student.email}</Text>
            </View>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.listTitleInnerContainer}>
          <Text style={styles.commonListLabel}>Amount :</Text>
          <Text style={styles.commonListText}>{`$${formatPrice(
            item.amount,
          )}`}</Text>
        </View>
        <View style={styles.listTitleInnerContainer}>
          <Text style={styles.commonListLabel}>Platform Fee :</Text>
          <Text style={styles.commonListText}>{`$${formatPrice(
            item.platformFee,
          )}`}</Text>
        </View>
        <View style={styles.listTitleInnerContainer}>
          <Text style={styles.commonListLabel}>Net Amount :</Text>
          <Text style={styles.commonListText}>{`$${formatPrice(
            item.netAmount,
          )}`}</Text>
        </View>
        <View style={styles.listTitleInnerContainer}>
          <Text style={styles.commonListLabel}>Date :</Text>
          <Text style={styles.commonListText}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'N/A'}
          </Text>
        </View>
      </View>
    );
  };

  const SelectionModal = ({
    isVisible,
    onClose,
    options,
    selectedValue,
    onSelect,
    title,
  }: any) => (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modalStyle}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{title}</Text>
        {options.map((option: any) => (
          <TouchableOpacity
            key={option.value}
            style={styles.itemSelect}
            onPress={() => {
              onSelect(option.value);
              onClose();
            }}
          >
            <Text
              style={[
                styles.itemTxt,
                { color: selectedValue === option.value ? COLORS.primary : '' },
              ]}
            >
              {option.label}
            </Text>
            {selectedValue === option.value && (
              <Icon name="Check" size={ms(20)} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );

  const renderHeader = () => (
    <View style={styles.headerMainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Member Transactions</Text>
        <Text style={styles.sectionDescription}>
          View and manage all member transactions for this community.
        </Text>
      </View>

      {/* Stats Grid */}
      {initialLoading ? (
        <StatsSkeleton />
      ) : (
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {stats.slice(0, 2).map(renderStatsCard)}
          </View>
          <View style={[styles.statsRow, styles.statsMargin]}>
            {stats.slice(2, 4).map(renderStatsCard)}
          </View>
        </View>
      )}

      {/* Search & Filters */}
      <View style={styles.filtersContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by member name or email..."
          searchInputStyle={styles.searchInput}
        />

        <View style={styles.filterRow}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status</Text>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setIsStatusModalVisible(true)}
            >
              <Text style={styles.filterButtonText}>
                {statusOptions.find(o => o.value === status)?.label || 'Status'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Sort By</Text>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setIsSortByModalVisible(true)}
            >
              <Text style={styles.filterButtonText}>
                {sortOptions.find(o => o.value === sortBy)?.label || 'Sort By'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterGroupLast}>
            <Text style={styles.filterLabel}>Order</Text>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setIsOrderModalVisible(true)}
            >
              <Text style={styles.filterButtonText}>
                {orderOptions.find(o => o.value === sortOrder)?.label ||
                  'Order'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (apiGetMemberTransactionsLoading && page > 1) {
      return (
        <ActivityIndicator
          size="small"
          color={COLORS.primary}
          style={styles.loader}
        />
      );
    }

    if (
      apiGetMemberTransactions?.data?.pagination &&
      page < apiGetMemberTransactions.data.pagination.totalPages
    ) {
      return (
        <TouchableOpacity
          onPress={() => setPage(prev => prev + 1)}
          style={styles.loadTouch}
          disabled={apiGetMemberTransactionsLoading}
        >
          <Text style={styles.loadTxt}>Load More</Text>
        </TouchableOpacity>
      );
    }
    return <View style={styles.extSpc} />;
  };

  const renderEmptyComponent = () => {
    if (initialLoading) {
      return <TransactionListSkeleton />;
    }

    return (
      <View style={styles.noDataView}>
        <Text style={styles.noDataHeader}>No transactions found</Text>
        <Text style={styles.noDataSubHeader}>
          Try adjusting your filters or search query to see more results.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}

      {initialLoading ? (
        <TransactionListSkeleton />
      ) : transactions.length > 0 ? (
        transactions.map((item: any, index: number) => (
          <React.Fragment key={item.id || item._id || index}>
            {renderTransactionItem({ item })}
          </React.Fragment>
        ))
      ) : (
        renderEmptyComponent()
      )}

      {renderFooter()}

      <SelectionModal
        isVisible={isStatusModalVisible}
        onClose={() => setIsStatusModalVisible(false)}
        options={statusOptions}
        selectedValue={status}
        onSelect={setStatus}
        title="Select Status"
      />
      <SelectionModal
        isVisible={isSortByModalVisible}
        onClose={() => setIsSortByModalVisible(false)}
        options={sortOptions}
        selectedValue={sortBy}
        onSelect={setSortBy}
        title="Sort By"
      />
      <SelectionModal
        isVisible={isOrderModalVisible}
        onClose={() => setIsOrderModalVisible(false)}
        options={orderOptions}
        selectedValue={sortOrder}
        onSelect={setSortOrder}
        title="Order"
      />
    </View>
  );
};

export default MemberTransactionsTab;
