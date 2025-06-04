from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Category
from django.contrib import messages
from .models import Expense

# Create your views here.
@login_required(login_url='/authentication/login')
def index(request):
    categories = Category.objects.all()
    expenses= Expense.objects.filter(owner=request.user)
    
    context={
        'expenses': expenses
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
