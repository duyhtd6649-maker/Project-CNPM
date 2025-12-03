#include "Money.h"
#include <fstream>

Money::Money()
{
    MoneyName = "";
    MoneyAmount = 0;
}

Money::Money(string name, float amount)
{
    MoneyName = name;
    MoneyAmount = amount;
}

void Money::ReadFromFile(ifstream&fin)
{
    getline(fin,MoneyName,':');
    fin >> MoneyAmount;
    fin.ignore();
}

void Money::WriteToFile(ofstream &fout)
{
    fout << MoneyName << ':' << MoneyAmount << "\n";
}

bool Money::checkname(Money &other)
{
    if (this->MoneyName == other.MoneyName)
        return true;
    else{return false;}
}

Money Money::operator+(Money &other)
{
   this->MoneyAmount += other.MoneyAmount;
   return *this;
}

void Money::swap(Money &other)
{
    Money temp = *this;
    *this = other;
    other = temp;
}

ostream &operator<<(ostream &out, const Money &th)
{
    out << th.MoneyName << ": " << th.MoneyAmount << ".000 VND";
    return out;
}
