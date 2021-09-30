import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {
  Container,
  Header,
  UserInfo,
  User,
  UserGreeting,
  UserName,
  Photo,
  UserWrapper,
  IconLogout,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton
} from './styles';
import {useTheme} from "@react-navigation/native";
import {HighlightCard} from "../../components/HighlightCard";
import {TransactionCard, TransactionCardProps} from "../../components/TransactionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect } from '@react-navigation/native'
import {LoadContainer} from "../Register/styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlihtProps {
  amount: string;
  lastTransactions: string
}

interface HighlightData {
  entries: HighlihtProps,
  expensives: HighlihtProps,
  total: HighlihtProps
}

export function Dashboard () {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();

  function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative') {
    const lastTransaction = new Date(Math
      .max
      .apply(Math, collection
        .filter((transaction) => transaction.type === type)
        .map((transaction) => new Date(transaction.date).getTime())));

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {
      month: 'long'
    })} de ${lastTransaction.getFullYear()}`;
  }

  async function loadTransactions() {
    const collectionKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(collectionKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {

      if (item.type === 'positive') {
        entriesTotal += Number(item.amount);
      }

      if (item.type === 'negative') {
        expensiveTotal += Number(item.amount);
      }

      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      }
    });
    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
    const totalInterval = `01 a ${lastTransactionExpensives}`;

    const total = entriesTotal - expensiveTotal;
    console.log({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactions: `Última entrada em ${lastTransactionEntries}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactions: `Última saida em ${lastTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactions: totalInterval,
      }
    });
    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactions: `Última entrada em ${lastTransactionEntries}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactions: `Última saida em ${lastTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactions: totalInterval,
      }
    });

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      {
        isLoading ? <LoadContainer><ActivityIndicator color={theme.colors.primary} size="large"/></LoadContainer> :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: "https://avatars.githubusercontent.com/u/2670682?v=4"}}/>
                <User>
                  <UserGreeting>Olá, </UserGreeting>
                  <UserName>Adan Felipe Medeiros</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={() => {}}>
                <IconLogout name="power" />
              </LogoutButton>

            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard type="up" title="Entradas" amount={highlightData.entries.amount} lastTransaction={highlightData.entries.lastTransactions}/>
            <HighlightCard type="down" title="Saidas" amount={highlightData.expensives.amount} lastTransaction={highlightData.expensives.lastTransactions} />
            <HighlightCard type="total" title="Total" amount={highlightData.total.amount} lastTransaction={highlightData.total.lastTransactions} />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionsList
              data={transactions}
              keyExtrator={item => item.id}
              renderItem={({ item }) => (<TransactionCard data={item} />)}
            />

          </Transactions>
        </>
      }
    </Container>
  );
}
