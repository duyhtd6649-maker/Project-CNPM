#include <iostream>
#include <string>
#include <vector>
#include "Manage.h"
#include "DateManagement.h"
using namespace std;
class Menu
{
private:        
    int choose, Day, Month, Year;
    string choose2;
    float Fund_Amount;
    string Fund_Name, temp_amount, name_upper;
    Manage Management;
public:
    Menu();
    int Is_Valid_Choose(string&context, char start, char end);
    void Display_Menu();
    void Display_Input_Menu();
    void Set_Fund_Name();
    void Set_Fund_Amount();
    bool Is_Amount_Valid(string amount);
    bool Is_A_Int(string choose);
    void Set_Date();
    void Set_Income();
    void Set_Spending();
    void Print_Funds(const vector<Money>&a);
    void Print_Balance();
    void Print_Summary();
    void Print_Date();
    void Exit();
    string Upper_string(string name);
    int getChoose(){return choose;}
};

