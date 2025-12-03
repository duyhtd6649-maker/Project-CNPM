#include "Manage.h"
#include <fstream>
#include <string>

Manage::Manage()
{
    Month_file = "money.txt";
    income = spending = balance = temp_mon = 0;
    choose = size_of_funds = ind = 0;
    NameOfMoneyType = "";
    Detect_Date_Part = "";
}

void Manage::ReadDataFormFile()
{
    ifstream fin(Month_file);
    while (getline(fin,NameOfMoneyType,':'))
    {
        if (NameOfMoneyType == "Balance"){
            fin >> balance;
            fin.ignore();
        }
        if (NameOfMoneyType == "Income"){
            this->IdentifyMoney(NameOfMoneyType,"Income", "Spending",fin,Income,income);
        }
        if (NameOfMoneyType == "Spending"){
            this->IdentifyMoney(NameOfMoneyType,"Spending", "Date",fin,Spending,spending);
            break;
        }
    }
    while (!fin.eof())
    {
        DateManagement *NewDate = new DateManagement;
        NewDate->ReadDataFromFile(fin);
        if (!NewDate->Date_Is_Valid()){
            delete NewDate;
            continue;
        }
        else{
            Dates.push_back(*NewDate);
            delete NewDate;
        }
    }
    fin.close();

}

void Manage::sort_Fund(vector<Money>&lst)
{
    if (lst.empty())
    {
        return;
    }
    else{
        for (int i = 0; i < lst.size()-1; i++)
        {
            for (int j = i+1; j < lst.size(); j++)
            {
                if (lst[i].GetAmount()<lst[j].GetAmount())
                {
                    lst[i].swap(lst[j]);
                }
                
            }       
        }
    }
}

void Manage::sort_Date()
{
    if (Dates.empty())
    {
        return;
    }
    else{
        for (int i = 0; i < Dates.size()-1; i++)
        {
            for (int j = i+1; j < Dates.size(); j++)
            {
                if (Dates[i].GetDay()>Dates[j].GetDay())
                {
                    Dates[i].swap(Dates[j]);
                }
                
            }
            
            
        }
    }
}

void Manage::IdentifyMoney(string &NameOfMoneyType, string start, string end, ifstream&fin, vector<Money>&lst, float &TypeOfMoney)
{
    
    fin >> TypeOfMoney;
    fin.ignore();
    while (true)
    {
        temp_mon = 0;
        getline(fin,NameOfMoneyType,':');
        if ((NameOfMoneyType == end)||(fin.eof())){
            break;
        }
        else{
            fin >> temp_mon;
            fin.ignore();
            Money Mon(NameOfMoneyType,temp_mon);
            lst.push_back(Mon);
        }
        
    }
        
    
}



void Manage::SaveIncomeOrSpendingToFile(ofstream&fout, vector<Money> &lst)
{
    for (auto p:lst)
    {
        p.WriteToFile(fout);
    }
}


void Manage::Calculate_Balance()
{
    this->Calculate(income,Income);
    this->Calculate(spending,Spending);
    balance = income - spending;
}

void Manage::Calculate(float &TypeOfMoney, vector<Money> lst)
{
    temp_mon = 0;
    sort_Fund(lst);
    for (auto p:lst)
    {
        temp_mon+=p.GetAmount();
    }
    TypeOfMoney = temp_mon;
    
}



void Manage::Save_To_File()
{
    cout << "\n---------- Saving!!! ----------" <<endl;
    ofstream fout(Month_file);
    fout << "Balance:" << balance << '\n';
    fout << "Income:" << income << '\n';
    this->SaveIncomeOrSpendingToFile(fout,Income);
    fout << "Spending:" << spending << '\n';
    this->SaveIncomeOrSpendingToFile(fout,Spending);
    fout <<"Date"<<':'<<'\n';   
    for (auto Date:Dates){
        Date.SaveToFile(fout);
    }
    fout.close();
}


void Manage::Set_Income(string &Fund_Name, float &Fund_Amount)
{
    Money *FundPushToIns = new Money(Fund_Name,Fund_Amount);
    this->Push_back_Fund(*FundPushToIns,Income);
    delete FundPushToIns;
}

void Manage::Set_Spending(string &Fund_Name, float &Fund_Amount)
{
    Money *FundPushToSpends=new Money(Fund_Name,Fund_Amount);
    this->Push_back_Fund(*FundPushToSpends,Spending);
    delete FundPushToSpends;
}

void Manage::Add_Fund_to_Date(string &fund_name, float fund_amount)
{
    Money *NewFund = new Money(fund_name,fund_amount);
    NewDate.PushFundToDayFunds(*NewFund);
    delete NewFund;
}

void Manage::Push_back_Fund(Money &Mon, vector<Money> &Funds)
{
    size_of_funds = Funds.size();
    ind = 0;
    while (true)
    {
        if ((size_of_funds == 0)||(!Mon.checkname(Funds[ind]))&&(ind == size_of_funds - 1)){
            Funds.push_back(Mon);
            break;
        }
        else
        {
            if (Mon.checkname(Funds[ind])){
                Funds[ind] = Funds[ind] + Mon;
                break;
            }
        }
        ind++;
    }
    
}

void Manage::PushDateToLst()
{   
    size_of_funds = Dates.size();
    ind = 0;
    if (NewDate.GetDateSize() == 0)
    {
        return;
    }
    else{
        NewDate.CalculateFund();
        while (true)
        {
            if ((size_of_funds == 0)||(!Dates[ind].IsDateExist(NewDate))&&(ind == size_of_funds - 1)){
                Dates.push_back(NewDate);
                break;
            }
            else
            {
                if (Dates[ind].IsDateExist(NewDate)){
                    Dates[ind].PushOtherFundToThisFund(NewDate);
                    break;
                }
            }
            ind++;
        }
    }
}


