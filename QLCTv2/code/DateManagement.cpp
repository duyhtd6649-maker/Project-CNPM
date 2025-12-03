#include "DateManagement.h"
#include <cstring>
#include <string>
#include <cmath>


DateManagement::DateManagement()
{
    FundOfDate = 0;
    Day = Month = Year = 1;
    ThirdtyOneMonth = {1,3,5,7,8,10,12};
    ThirdtyMonth = {4,6,9,11};

}

DateManagement::DateManagement(int Day, int Month, int Year)
{
    this->Day = Day;
    this->Month = Month;
    this->Year = Year;
    FundOfDate = 0;
    ThirdtyOneMonth = {1,3,5,7,8,10,12};
    ThirdtyMonth = {4,6,9,11};
}

void DateManagement::PushFundToDayFunds(Money&Fund)
{
    DayFunds.push_back(Fund);
    this->CalculateFund();
}

void DateManagement::ReadDataFromFile(ifstream&fin)
{
    fin >> temp >> Day >> temp >> Month >> temp >> Year >> temp>> temp;
    if (!Date_Is_Valid())
    {
        return;
    }
    else{
        fin >> FundOfDate;
        fin.ignore();
        while (true)
        {
            if ((fin.peek() == '[')||(fin.eof()))
            {
                break;
            }
            else
            {
                string FundName;
                float amount = 0;
                getline(fin,FundName,':');
                fin >> amount;
                fin.ignore();
                Money NewFund(FundName,amount);
                DayFunds.push_back(NewFund);
            }
        }
    }
    
}

void DateManagement::DisplayDateFunds()
{
    cout << '[' << Day << '/' << Month << '/' << Year << ']' << ':'<< FundOfDate << ".000 VND" << endl;
    for (auto Fund:DayFunds)
    {
        cout << Fund << endl;
    }
}

void DateManagement::SaveToFile(ofstream &fout)
{
    fout << '[' << Day << '/' << Month << '/' << Year << ']' << ':' << FundOfDate << '\n';
    for (auto Fund:DayFunds)
    {
        Fund.WriteToFile(fout);
    }

}

void DateManagement::CalculateFund()
{
    float TotalFunds = 0;
    for (auto Fund:DayFunds)
    {
        TotalFunds += Fund.GetAmount();
    }
    FundOfDate = TotalFunds;
}

bool DateManagement::IsDateExist(DateManagement &other)
{
    if (this->Day == other.Day && this->Month == other.Month && this->Year == other.Year)
        return true;
    else
        return false;
}

void DateManagement::PushOtherFundToThisFund(DateManagement&other)
{
    for (auto Fund:other.DayFunds)
    {
        int i = 0;
        this->IsFundExist(Fund,this->DayFunds,i);
    }
    this->CalculateFund();
}

void DateManagement::IsFundExist(Money &Fund, vector<Money>&Mainlst, int i)
{
    while(true){
        if (Fund.checkname(Mainlst[i]))
        {
            Mainlst[i] = Mainlst[i] + Fund;
            break;
        }
        else
        {
            if (i == Mainlst.size()-1)
            {
                Mainlst.push_back(Fund);
                break;
            }
            else
            {
                IsFundExist(Fund,Mainlst,i+1);
                break;
            }
        }
        
    }
}

void DateManagement::swap(DateManagement &other)
{
    DateManagement temp = *this;
    *this = other;
    other = temp;
}


bool DateManagement::Date_Is_Valid()
{
    bool IsValid = false;
    if (Day == 0 || Month == 0 || Year == 0)
    {
        return false;
    }
    else{
        for (auto M:ThirdtyMonth){
            if (Month == M && Day <=30 && Year > 0){
                IsValid = true;
                break;
            }
        }
        for (auto M:ThirdtyOneMonth){
            if (Month == M && Day <=31 && Year > 0){
                IsValid = true;
                break;
            }
        }
        if (Month == 2 && Day <=28 && !IsLeapYear())
            IsValid = true;
        else if (Month == 2 && Day <= 29 && IsLeapYear())
            IsValid = true;
        return IsValid;
    }
       
}

bool DateManagement::IsLeapYear()
{
    if (abs(Year - 2024)%4==0)
        return true;
    else
        return false;
}
