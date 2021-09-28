import React from 'react';

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
  TransactionsList
} from './styles';
import {HighlightCard} from "../../components/HighlightCard";
import {TransactionCard, TransactionCardProps} from "../../components/TransactionCard";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard () {
  const data = [{
    id: '1',
    type: 'positive',
    amount: "R$ 12.000,00",
    title: "Desenvolvimento de site",
    category: { name: "Vendas", icon: "dollar-sign"},
    date: "13/04/2020"
  }, {
    id: '2',
    type: 'negative',
    amount: "R$ 59,00",
    title: "Hamburgeria Pizzy",
    category: { name: "Alimentação", icon: "coffee"},
    date: "10/04/2020"
  }, {
    id: '3',
    type: 'negative',
    amount: "R$ 1.200,00",
    title: "Aluguel do apartamento",
    category: { name: "Casa", icon: "shopping-bag"},
    date: "10/04/2020"
  }];

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: "https://avatars.githubusercontent.com/u/2670682?v=4"}}/>
            <User>
              <UserGreeting>Olá, </UserGreeting>
              <UserName>Adan Felipe Medeiros</UserName>
            </User>
          </UserInfo>

          <IconLogout name="power" />
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard type="up" title="Entradas" amount="R$ 17.400,00" lastTransaction="Ultima transação dia 13 de abril"/>
        <HighlightCard type="down" title="Saidas" amount="R$ 1.259,00" lastTransaction="Ultima saida dia 03 de abril"/>
        <HighlightCard type="total" title="Total" amount="R$ 16.141,00" lastTransaction="01 à 16 de abril"/>
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionsList
          data={data}
          keyExtrator={item => item.id}
          renderItem={({ item }) => (<TransactionCard data={item} />)}
        >
        </TransactionsList>

      </Transactions>
    </Container>
  );
}
