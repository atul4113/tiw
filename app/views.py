from django.shortcuts import render

# Create your views here.
def index(request):
    if is_logged_in():
        return render(request, "index.htm")
    else:
        return redirect(url_for("login"))
    pass
