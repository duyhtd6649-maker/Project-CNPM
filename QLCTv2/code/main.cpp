#include <iostream>
#include "Manage.h"
#include "Menu.h"
using namespace std;

int main()
{
    Menu FinancialManagement;
    while (FinancialManagement.getChoose() != 5)
    {
        FinancialManagement.Display_Menu();
        switch (FinancialManagement.getChoose())
        {
        case 1:
            system("cls");
            FinancialManagement.Display_Input_Menu();   
            break;
        case 2:
            system("cls");
            FinancialManagement.Print_Balance();
            break;
        case 3:
            system("cls");
            FinancialManagement.Print_Summary();
            break;
        case 4:
            system("cls");
            FinancialManagement.Print_Date();
            break;
        case 5:
            system("cls");
            FinancialManagement.Exit();
            break;
        default:
            break;
        }
    }
}