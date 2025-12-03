#pragma once
#include <iostream>
#include <vector>
#include "Money.h"
#include "DateManagement.h"
using namespace std;

class Manage
{
private:
    float balance, income, spending, temp_mon;
    int choose, size_of_funds, ind;
    string NameOfMoneyType;
    string Detect_Date_Part;
    string Month_file;
    DateManagement NewDate;
    vector<Money>Income;
    vector<Money>Spending;
    vector<DateManagement>Dates;
public:
    Manage();
    void ReadDataFormFile();
    void sort_Fund(vector<Money>&lst);
    void sort_Date();
    void IdentifyMoney(string &NameOfMoney, string start, string end, ifstream&fin, vector<Money>&lst, float&TypeOfMoney);
    void SaveIncomeOrSpendingToFile(ofstream&fout, vector<Money> &lst);
    void Calculate_Balance();
    void Calculate(float &TypeOfMoney, vector<Money>lst);
    void Save_To_File();
    void Set_Income(string&Fund_Name, float&Fund_Amount);
    void Set_Spending(string&Fund_Name, float&Fund_Amount);
    void Set_Date(DateManagement&date){NewDate = date;}
    void Add_Fund_to_Date(string&fund_name, float fund_amount);
    void Push_back_Fund(Money&Mon, vector<Money>&Funds);
    void PushDateToLst();
    float Get_balance(){return balance;}
    float Get_income(){return income;}
    float Get_spending(){return spending;}
    vector<Money> Get_Incomes(){return Income;}
    vector<Money> Get_Spending(){return Spending;}
    vector<DateManagement> Get_Dates(){return Dates;}

};


