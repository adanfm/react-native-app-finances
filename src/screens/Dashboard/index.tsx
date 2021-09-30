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

    const total = entriesTotal - expensiveTotal;
    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
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
            <HighlightCard type="up" title="Entradas" amount={highlightData.entries.amount} lastTransaction="Ultima transação dia 13 de abril"/>
            <HighlightCard type="down" title="Saidas" amount={highlightData.expensives.amount} lastTransaction="Ultima saida dia 03 de abril"/>
            <HighlightCard type="total" title="Total" amount={highlightData.total.amount} lastTransaction="01 à 16 de abril"/>
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionsList
              data={transactions}
              keyExtrator={item => item.id}
              renderItem={({ item }) => (<TransactionCard data={item} />)}
            >
            </TransactionsList>

          </Transactions>
        </>
      }
    </Container>
  );
}
