import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ActivityIndicator } from 'react-native';

import {Container, Header, Title, Content, ChartContainer, MonthSelect, MonthSelectButton, MonthSelectIcon, Month, LoadContainer} from './styles';
import {HistoryCard} from "../../components/HistoryCard";
import { categories } from '../../utils/categories';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../global/styles/theme';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale'
import { useFocusEffect } from '@react-navigation/core';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string,
  date: string
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CategoryData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  function handleChangeDate(action: 'next' | 'prev') {
    if (action === 'next') {
      const newDate = addMonths(selectedDate, 1);
      setSelectedDate(newDate);
    } else {
      const newDate = subMonths(selectedDate, 1);
      setSelectedDate(newDate);
    }
  } 

  async function loadData() {
    setIsLoading(true);
    const collectionKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(collectionKey);
    const transactions = response ? JSON.parse(response) : [];

    const expensives = transactions.filter((expensive:TransactionData) => 
    expensive.type === 'negative' && new Date(expensive.date).getMonth() === selectedDate.getMonth() && new Date(expensive.date).getFullYear() === selectedDate.getFullYear());
    
    const exposivesTotal = expensives.reduce((accumullator: number,expensive: TransactionData) => {
      return accumullator + Number(expensive.amount);
    }, 0);

    const totalByCategory: CategoryData[] = [];
    
    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach(expensive => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });
      
      if (categorySum > 0) {
        const percent = `${(categorySum / exposivesTotal * 100).toFixed(0)}%`;
        totalByCategory.push({
          key: category.key,
          name: category.name,
          totalFormatted: categorySum.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          total: categorySum,
          color: category.color,
          percent,
        });
      }
    });
    setData(totalByCategory);
    setIsLoading(false);
  }


  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]));

  return (

    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {
      isLoading ? 
      <LoadContainer><ActivityIndicator color={theme.colors.primary} size="large"/></LoadContainer> :
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
            flex: 1,
          }}
        >

          <MonthSelect>
            <MonthSelectButton onPress={() => handleChangeDate('prev')}>
              <MonthSelectIcon name="chevron-left"/>
            </MonthSelectButton>

            <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR})}</Month>
            <MonthSelectButton onPress={() => handleChangeDate('next')}>
              <MonthSelectIcon name="chevron-right"/>
            </MonthSelectButton>
          </MonthSelect>
          
          
          <ChartContainer>
            <VictoryPie 
              data={data}
              style={{
                labels: {
                  fontSize: 18,
                  fontWeight: 'bold',
                  fill: theme.colors.shape
                }
              }}
              labelRadius={60}
              colorScale={data.map(category => category.color)}
              x="percent"
              y="total"
            />
          </ChartContainer>
          {
            data.map(item => (
              <HistoryCard title={item.name} color={item.color} amount={item.totalFormatted} key={item.key}/>
            ))
          }
        </Content>
      }
    </Container>
  )
}
