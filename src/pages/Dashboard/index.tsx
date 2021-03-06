import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface UnformattedBalance {
  income: number;
  outcome: number;
  total: number;
}
interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  // TODO: Refatorar para mais perfomace na renderização do formatValue(Uma única vez quando carregar da api)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get<{
        balance: UnformattedBalance;
        transactions: Transaction[];
      }>('/transactions');
      const downloadedBalance = response.data.balance;
      const downloadedTransactions: Transaction[] = response.data.transactions.map(
        transaction => {
          return {
            ...transaction,
            formattedDate: new Date(
              transaction.created_at,
            ).toLocaleDateString(),
            formattedValue: formatValue(transaction.value),
          };
        },
      );
      const formattedBalance: Balance = {
        income: formatValue(downloadedBalance.income),
        outcome: formatValue(downloadedBalance.outcome),
        total: formatValue(downloadedBalance.total),
      };
      setBalance(formattedBalance);
      setTransactions(downloadedTransactions);
    }

    loadTransactions();
  }, []);

  const renderTransactions = React.useMemo(() => {
    if (transactions) {
      return transactions?.map(transaction => (
        <tr key={transaction.id}>
          <td className="title">{transaction.title}</td>
          <td className={transaction.type === 'income' ? 'income' : 'outcome'}>
            {transaction.type === 'income' ? '' : '- '}
            {formatValue(transaction.value)}
          </td>
          <td>{transaction.category.title}</td>
          <td>{transaction.formattedDate}</td>
        </tr>
      ));
    }
    return null;
  }, [transactions]);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>{renderTransactions}</tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
