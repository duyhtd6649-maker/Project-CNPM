#pragma once
#include <iostream>
#include <string>
#include <vector>
#include "Money.h"
#include <fstream>
using namespace std;

class DateManagement
{
private:
    char temp;
    vector<int> ThirdtyOneMonth;
    vector<int> ThirdtyMonth;
    int Day, Month, Year;
    float FundOfDate;
    vector<Money>DayFunds;
public:
    DateManagement();
    DateManagement(int Day, int Month, int Year);
    void PushFundToDayFunds(Money&Fund);
    void ReadDataFromFile(ifstream&fin);
    void DisplayDateFunds();
    void SaveToFile(ofstream&fout);
    void CalculateFund();
    bool IsDateExist(DateManagement&other);
    void PushOtherFundToThisFund(DateManagement&other);
    void IsFundExist(Money&Fund, vector<Money>&Mainlst, int i);
    void swap(DateManagement&other);
    int GetDay(){return Day;}
    int GetDateSize(){return DayFunds.size();}
    vector<int> getThirdtyOneMonth(){return ThirdtyOneMonth;}
    vector<int> getThirdtyMonth(){return ThirdtyMonth;}
    bool Date_Is_Valid();
    bool IsLeapYear();
};
