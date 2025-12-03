#include "Menu.h"

Menu::Menu()
{
    Manage *M = new Manage;
    Management = *M;
    Management.ReadDataFormFile();
    choose, Day, Month, Year = 0;
    choose2 ="";
    Fund_Amount=0;
    Fund_Name, temp_amount, name_upper="";
    delete M;
}

int Menu::Is_Valid_Choose(string &context, char start, char end)
{
    int choose;
    string options;
    while(true){
        cout << context;
        getline(cin,options);
        if (Is_A_Int(options)&&(int)options[0] >= start && (int)options[0]<=end)
        {
                choose =stoi(options);
                break;
        }
        else{
            system("cls");
            cout << "\nInvalid Input, try again!!!" << endl;
            continue;
        }
    }
    return choose;
}

void Menu::Display_Menu()
{
    
    string context = "\n---------- Financial Management ---------\n1. Enter your spending/income. \n2. Display balance. \n3. Display Sumary.\n4. Display dates. \n5. Exit. \nChoosing: ";
    choose = this->Is_Valid_Choose(context,'1','5');
}

void Menu::Display_Input_Menu()
{
    this->Set_Date();
    string context = "\n---------- Chose one action ----------\n1. Enter your incomes. \n2. Enter your spending. \n3. Exit. \nYour choose: ";
    while (choose != 3)
    {
        choose = this->Is_Valid_Choose(context,'1','3');
        switch (choose)
        {
        case 1:
            this->Set_Income();
            break;
        case 2:
            this->Set_Spending();
            break;
        case 3:
            Management.PushDateToLst();
            break;        
        default:
            break;
        }

    }
    
}

void Menu::Set_Fund_Name()
{
    printf("Name (type \"Exit\" to exit): ");
    getline(cin,Fund_Name);

}

void Menu::Set_Fund_Amount()
{   
    bool InValid = true;
    do
    {  
        printf("Amount (thousand VND): ");
        getline(cin,temp_amount);   
        if (!Is_Amount_Valid(temp_amount)){
            InValid = true;
            system("cls");
            cout << "\nInvalid input, try again!!!" << endl;
        }
        else{
            Fund_Amount = stof(temp_amount);
            InValid = false;
        }
    } while (InValid);       
    
}


bool Menu::Is_Amount_Valid(string amount)
{
    bool isvalid = false;
    int count_dots = 0;
    for (int i = 0; i < amount.size(); i++)
    {
        if ((int)amount[i] >= 48 && (int)amount[i] <=57)
            isvalid = true;
        else if ((int)amount[i] == 46 && count_dots == 0){
            count_dots++;
            isvalid = true;
        }
        else{
            isvalid = false;
        }
    }
    if (isvalid == true)
    {
        if (stof(amount) == 0)
            isvalid = false;
    }
    return isvalid;
}

bool Menu::Is_A_Int(string choose)
{
    bool isvalid = false;
    if (choose.size() == 1 && (int)choose[0] >= 48 && (int)choose[0] <=57)
        isvalid = true;
    return isvalid;
}

void Menu::Set_Date()
{   
    char temp; 
    cout << "\n---------- Enter Date ----------" <<endl;
    bool IsValid = true;
    do
    {
        printf("Date (dd/mm/yy): ");
        cin >> Day >> temp >> Month >> temp >> Year;
        cin.ignore();
        DateManagement *UnCheckDate = new DateManagement(Day,Month,Year);
        if (!UnCheckDate->Date_Is_Valid())
        {
            system("cls");
            cout << "Invalid Date!!! - Please try again!"<< endl;
            IsValid = true;
        }
        else{ 
            Management.Set_Date(*UnCheckDate);
            delete UnCheckDate;
            IsValid = false;
        }
        
    } while (IsValid);
}

void Menu::Set_Income()
{
    while (true){
        system("cls");
        cout << "\n---------- Enter your Income ----------" <<endl;
        this->Set_Fund_Name();
        if (Upper_string(Fund_Name) == "EXIT")
            break;
        this->Set_Fund_Amount();
        Management.Set_Income(Fund_Name,Fund_Amount);
        Management.Add_Fund_to_Date(Fund_Name,Fund_Amount);
            
    }
}

void Menu::Set_Spending()
{
    while (true){
        system("cls");
        cout << "\n---------- Enter your Spending ----------" <<endl;
        this->Set_Fund_Name();
        if (Upper_string(Fund_Name) =="EXIT")
            break;
        this->Set_Fund_Amount();
        Management.Set_Spending(Fund_Name,Fund_Amount);
        Management.Add_Fund_to_Date(Fund_Name,-Fund_Amount);
    }
}

void Menu::Print_Funds(const vector<Money>&a)
{
    for (const auto&f : a){
        cout << f << endl;
    }
}

void Menu::Print_Balance()
{   Management.Calculate_Balance();
    cout << "\n---------- Your Balance ----------" <<endl;
    cout << "Balance: " << Management.Get_balance() << ".000 VND" << endl;
    cout << "Income: " << Management.Get_income() << ".000 VND" << endl;
    cout << "Spending: " << Management.Get_spending() << ".000 VND" << endl;
}

void Menu::Print_Summary()
{
    const vector<Money>&Incomes = Management.Get_Incomes();
    const vector<Money>&Spends = Management.Get_Spending();
    Management.Calculate_Balance();
    cout << '\n' << string(5,'-') << "Income" << string(5,'-') <<endl;
    Print_Funds(Incomes);
    cout << '\n' << string(5,'-') << "Spending" << string(5,'-') <<endl;
    Print_Funds(Spends);
}

void Menu::Print_Date()
{
    Management.sort_Date();
    cout << '\n' << string(5,'-') << "Dates" << string(5,'-') <<endl;
    for (auto&date:Management.Get_Dates()){
        date.DisplayDateFunds();
        cout << endl;
    }
}

void Menu::Exit()
{
    Management.Save_To_File();
    cout << "\nThanks for visitting!!!\nKeep your money!!!"<<endl;
}

string Menu::Upper_string(string name)
{
    name_upper = name;
    for (auto c = name_upper.begin(); c != name_upper.end(); ++c){
        *c = toupper(*c);
    }
    return name_upper;
}
