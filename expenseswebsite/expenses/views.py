from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Category
from django.contrib import messages
from .models import Expense
from django.core.paginator import Paginator
import json
from userpreferences.models import UserPreferences

# Create your views here.

def search_expenses(request):
    if request.method == 'POST':
        search_str = json.loads(request.body).get('searchText')
        expenses = Expense.objects.filter(
            amount__istartswith=search_str, owner=request.user) | Expense.objects.filter(
            date__istartswith=search_str, owner=request.user) | Expense.objects.filter(
            description__icontains=search_str, owner=request.user) | Expense.objects.filter(
            category__icontains=search_str, owner=request.user)
        data = expenses.values()
        return JsonResponse(list(data), safe=False)

@login_required(login_url='/authentication/login')
def index(request):
    categories = Category.objects.all()
    expenses= Expense.objects.filter(owner=request.user)
    paginator = Paginator(expenses, 5)  
    page_number = request.GET.get('page')
    page_obj=Paginator.get_page(paginator, page_number)
    currency= UserPreferences.objects.get(user=request.user).currency
    context={
        'expenses': expenses,
        'page_obj': page_obj,
        'currency': currency,
    }
    return render(request, 'expenses/index.html', context)

def add_expense(request):
    categories = Category.objects.all()
    context ={
        'categories': categories,
        'values': request.POST
    }
    if request.method == "GET":
        
        return render(request, "expenses/add_expense.html", context)

    if request.method == "POST":
        amount = request.POST["amount"]
        
        if not amount:
            messages.error(request, "Amount is required")
            return render(request, "expenses/add_expense.html", context)
        description = request.POST["description"]
        date = request.POST['expense_date']
        category = request.POST['category']
        
        if not description:
            messages.error(request, "Description is required")
            return render(request, "expenses/add_expense.html", context)
        
        Expense.objects.create(amount=amount, date=date, category=category, description=description, owner=request.user)
        messages.success(request, 'Expense saved successfully')
        
        return redirect('expenses')

def expense_edit(request, id):
    expense= Expense.objects.get(pk=id)
    categories = Category.objects.all()
    context = {
        'expense': expense,
        'values': expense,
        'categories': categories,
    }
    if request.method == "GET":
        return render(request, 'expenses/expense-edit.html', context)
    if request.method == "POST":
        amount = request.POST["amount"]
        
        if not amount:
            messages.error(request, "Amount is required")
            return render(request, "expenses/expense-edit.html", context)
        description = request.POST["description"]
        date = request.POST['expense_date']
        category = request.POST['category']
        
        if not description:
            messages.error(request, "Description is required")
            return render(request, "expenses/expense-edit.html", context)
        
        expense.amount = amount
        expense.date = date
        expense.category = category
        expense.description = description
        expense.owner = request.user
        expense.save()
        messages.success(request, 'Expense update successfully')
        
        return redirect('expenses')
        
    else:
        messages.info(request, 'Handling post form')
        return render(request, 'expenses/expense-edit.html', context)

def delete_expense(request, id):
    expense=Expense.objects.get(pk=id)
    expense.delete()
    messages.success(request, 'Expense deleted successfully')
    return redirect('expenses')
