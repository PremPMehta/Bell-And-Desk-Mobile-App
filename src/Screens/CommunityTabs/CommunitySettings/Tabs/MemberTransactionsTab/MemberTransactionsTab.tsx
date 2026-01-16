import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import Icon from '@/Components/Core/Icons';
import SearchBar from '@/Components/Core/SearchBar';
import styles from './style';

const MemberTransactionsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const stats = [
    { title: 'Total Transactions', value: '1', icon: 'Users' },
    { title: 'Total Revenue', value: '$45.00', icon: 'DollarSign' },
    { title: 'Net Amount', value: '$45.00', icon: 'TrendingUp' },
    { title: 'Success Rate', value: '100%', icon: 'CircleCheck' },
  ];

  const transactions = [
    {
      id: '1',
      name: 'Athena Campbell',
      email: 'pyjie@mailinator.com',
      amount: '$45.00',
      status: 'Succeeded',
      platformFee: '$00.00',
      netAmount: '$45.00',
      date: 'Nov 26, 2025, 06:06 PM',
      initials: 'A',
    },
    {
      id: '2',
      name: 'Jack Smith',
      email: 'jack@mailinator.com',
      amount: '$45.00',
      status: 'Succeeded',
      platformFee: '$00.00',
      netAmount: '$45.00',
      date: 'Nov 26, 2025, 06:06 PM',
      initials: 'A',
    },
    // Add more mock data if needed
  ];

  const renderStatsCard = (item: any, index: number) => {
    // Determine margin based on index for spacing
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

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Member Transactions</Text>
          <Text style={styles.sectionDescription}>
            View and manage all member transactions for this community.
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {stats.slice(0, 2).map(renderStatsCard)}
          </View>
          <View style={[styles.statsRow, { marginTop: ms(10) }]}>
            {stats.slice(2, 4).map(renderStatsCard)}
          </View>
        </View>

        {/* Search & Filters */}
        <View style={styles.filtersContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by member name or email..."
            searchInputStyle={{ height: ms(40) }}
          />

          <View style={styles.filterRow}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Status</Text>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>Succeeded</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Sort By</Text>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>Amount</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.filterGroupLast}>
              <Text style={styles.filterLabel}>Order</Text>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>Asc</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Transactions Table */}
        <View style={styles.tableContainer}>
          {transactions.map(item => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.listTitleContainer}>
                <View style={styles.memberInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.initials}</Text>
                  </View>
                  <View>
                    <Text style={styles.memberName}>{item.name}</Text>
                    <Text style={styles.memberEmail}>{item.email}</Text>
                  </View>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <View style={styles.listTitleInnerContainer}>
                <Text style={styles.commonListLabel}>Amount :</Text>
                <Text style={styles.commonListText}>{item.amount}</Text>
              </View>
              <View style={styles.listTitleInnerContainer}>
                <Text style={styles.commonListLabel}>Platform Fee :</Text>
                <Text style={styles.commonListText}>{item.platformFee}</Text>
              </View>
              <View style={styles.listTitleInnerContainer}>
                <Text style={styles.commonListLabel}>Net Amount :</Text>
                <Text style={styles.commonListText}>{item.netAmount}</Text>
              </View>
              <View style={styles.listTitleInnerContainer}>
                <Text style={styles.commonListLabel}>Date :</Text>
                <Text style={styles.commonListText}>{item.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.space} />
    </>
  );
};

export default MemberTransactionsTab;
