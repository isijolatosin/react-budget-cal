import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Alert from './components/Alert';
import { v4 as uuidv4 } from 'uuid';

let uuid = uuidv4;

// const initialExpenses = [
//   { id: uuid(), charge: 'rent', amount: 1600 },
//   { id: uuid(), charge: 'car payment', amount: 400 },
//   { id: uuid(), charge: 'credit card bill', amount: 1200 },
// ];

//local storage setup
const initialExpenses = localStorage.getItem('expense')
  ? JSON.parse(localStorage.getItem('expense'))
  : [];

function App() {
  //*************** state values *****************//
  //all expenses,add expense
  const [expenses, setExpenses] = useState(initialExpenses);
  //single charge
  const [charge, setCharge] = useState('');
  //single amount
  const [amount, setAmount] = useState('');
  // alert
  const [alert, setAlert] = useState({ show: false });
  // edit
  const [edit, setEdit] = useState(false);
  // edit item
  const [id, setId] = useState(0);

  //*************** use effect *****************//
  useEffect(() => {
    localStorage.setItem('expense', JSON.stringify(expenses));
  }, [expenses]); // if you don't have tell when to call the useEffect, it will get called every time the state values changes. In this situation, useEffect is called only when expenses changes it state(when we add to the expenses list).

  //*************** functionality *****************//
  //handle charge
  const handleCharge = (event) => {
    setCharge(event.target.value);
  };

  //handle amount
  const handleAmount = (event) => {
    setAmount(event.target.value);
  };

  //handle alert
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 1000);
  };

  //clear expenses
  const handleClear = () => {
    setExpenses([]);
  };

  //handle delete
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter((item) => item.id !== id);
    setExpenses(tempExpenses);
  };
  //handle edit
  const handleEdit = (id) => {
    let expenseEditted = expenses.find((expense) => expense.id === id);
    let { charge, amount } = expenseEditted;
    setCharge(charge);
    setAmount(amount);
    // handleDelete(id);
    setEdit(true);
    setId(id);
  };

  //handle submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (charge !== '' && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map((item) => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type: 'success', text: 'item editted' });
      } else {
        const singleExpense = {
          id: uuid(),
          charge: charge,
          amount: amount,
        };
        setExpenses([...expenses, singleExpense]);
        handleAlert({ type: 'success', text: 'item added' });
      }

      setCharge('');
      setAmount('');
    } else {
      handleAlert({
        type: 'danger',
        text:
          'charge can not be empty and amount value must be bigger than zero',
      });
    }
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>budget calculator</h1>
      <main className='App'>
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleCharge={handleCharge}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleClear={handleClear}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </main>
      <h1>
        total expenditure :{' '}
        <span className='total'>
          ${' '}
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
