#pragma once
#include <iostream>
#include <string>
using namespace std;

class Money
{
private:
    string MoneyName;
    float MoneyAmount;
public:
    Money();
    Money(string name, float amount);
    void SetName(string name){MoneyName=name;}
    void SetAmount(float Amount){MoneyAmount=Amount;}
    string GetName(){return MoneyName;}
    float GetAmount(){return MoneyAmount;}
    void ReadFromFile(ifstream&fin);
    void WriteToFile(ofstream&fout);
    bool checkname(Money&other);
    Money operator+(Money&other);
    void swap(Money&other);
    friend ostream& operator<<(ostream&out, const Money&th);
};