from flask import Flask, request, render_template, redirect
from cryptography.fernet import Fernet
import random
import sqlite3
import subprocess
import json

db = sqlite3.connect("database.db", check_same_thread=False)

app = Flask(__name__)

#---------------------------------------------------------------------------------------------------------------------------
# app utility functions
#---------------------------------------------------------------------------------------------------------------------------

# function fpr fetching the rearrange problem from the database using the id of the problem
def fetch_problem_from_db(id):
    temp = db.cursor()
    temp.execute("select * from problems where id = ?", (id, ))
    lis = temp.fetchall()
    temp.close()
    return lis[0]

# function for creating the table for the rearrange problems
def generate_string(string:str) -> str:
    string = [ elem for elem in string.split("\n") if elem != ""]
    lis_of_elem, temp_dic, counter = [], {}, 1
    for elem in string:
        if elem not in temp_dic:
            temp_dic[elem] = counter
            counter += 1
            lis_of_elem.append((temp_dic[elem], elem))
        else:
            lis_of_elem.append((temp_dic[elem], elem))
    return lis_of_elem

# function for encryption of email password etc.
def encryptor(email, password):
    key = Fernet.generate_key()
    fernet = Fernet(key)
    email = str(fernet.encrypt(email.encode()))
    password = str(fernet.encrypt(password.encode()))
    return email, password, str(key)

# function for decryption of email password etc.
def decryptor(encMessage, key):
    key = bytes(key[2:-1], encoding="utf8")
    encMessage = bytes(encMessage[2:-1], encoding="utf8")
    fernet = Fernet(key)
    decMessage = fernet.decrypt(encMessage).decode()
    return decMessage

# correct answer code generator for rearrange questions
def secret_code_generator():
    l = ""
    for i in range(10):
        l += str(random.randint(0, 9))
    return l

# function for fetching the output of the code
def fetch_code_output(code, name_of_user):
    with open(name_of_user, "w") as file:
        file.write(code)
    command = f'python temp.py'
    process = subprocess.Popen(command, stdout= subprocess.PIPE, stderr= subprocess.PIPE, shell = True)
    output, error = process.communicate()
    output, error = output.decode('utf-8'), error.decode('utf-8')
    return output, error
    
#------------------------------------------------------------------------------------------------------------------------------
# app routing functions
#------------------------------------------------------------------------------------------------------------------------------

@app.route("/", methods= ["GET", "POST"])
def index():
    if request.method == "GET":
        return render_template("login.html")
    email = request.form.get("email")
    password = request.form.get("pass")
    temp = db.cursor()
    temp.execute("select * from users where email = ? and password = ?", (email, password))
    lis = temp.fetchall()
    temp.close()
    if lis == []:
        return render_template("login.html", message= "Wrong Email Id or Password. Please Try Again.")
    email, password, key = encryptor(email, password)
    return redirect("/problems/?e="+email+"&p="+password+"&k="+key)

@app.route("/create_account/", methods=["GET", "POST"])
def create_account():
    if request.method == "GET":
        return render_template("create_account.html")
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('pass')
    confirmed_pass = request.form.get('pass2')
    if confirmed_pass != password:
        return render_template("create_account.html", message="Password and Confirmed Passwords did not match. Please Try Again.") 
    temp = db.cursor()
    temp.execute("select email from users")
    lis_of_emails = temp.fetchall()[0]
    temp.close()
    if email in lis_of_emails:
        return render_template("create_account.html", message= "Email Id already exists. Please Sign In instead.")
    temp = db.cursor()
    temp.execute("insert into users values(?, ?, ?, ?)", (email, username, password, ""))
    temp.close()
    db.commit()
    email, password, key = encryptor(email, password)
    return redirect("/problems/?e="+email+"&p="+password+"&k="+key)

@app.route("/problems/")
def problems():
    email, password, key = request.args.get("e"), request.args.get("p"), request.args.get("k")
    email = decryptor(email, key)
    password = decryptor(password, key)
    temp = db.cursor()
    temp.execute("select name from users where email = ? and password = ?", (email, password))
    name = temp.fetchall()[0][0]
    temp.close()
    email, password, key = encryptor(email, password)
    url = "?e="+email+"&p="+password+"&k="+key
    return render_template("problems_page.html", name = name, url = url)
    

@app.route("/problems/rearrange/")
def rearrange_problems_page():
    email, password, key = request.args.get("e"), request.args.get("p"), request.args.get("k")
    email = decryptor(email, key)
    password = decryptor(password, key)
    temp = db.cursor()
    temp.execute("select name from users where email = ? and password = ?", (email, password))
    name = temp.fetchall()[0][0]
    temp.close()
    code = request.args.get("c")
    encrypted_code = request.args.get("ec")
    key = request.args.get("solved_key")
    if code != None and encrypted_code != None and key != None and request.args.get("solved_id") != None:
        decrypted_code = decryptor(encrypted_code, key)
        if decrypted_code == code:
            solved_problem = int(request.args.get("solved_id"))
            if solved_problem != None:
                temp = db.cursor()
                temp.execute("select rearrange_problems_solved from users where email = ? and password = ?", (email, password))
                lis = temp.fetchall()[0][0]
                if lis != "":
                    probs = [int(elem) for elem in lis.split(" ")]
                else:
                    probs = []
                temp.close()
                if solved_problem not in probs:
                    probs.append(solved_problem)
                    probs = list(set(probs))
                    probs = " ".join([str(i) for i in probs])
                    temp = db.cursor()
                    temp.execute("update users set rearrange_problems_solved = ? where email = ? and password = ?", (probs, email, password))
                    temp.close()
                    db.commit()
    temp = db.cursor()
    temp.execute("select rearrange_problems_solved from users where email = ? and password = ?", (email, password))
    lis = temp.fetchall()[0][0]
    if lis != "":
        probs = [int(elem) for elem in lis.split(" ")]
    else:
        probs = []
    temp.close()
    prob_id = (request.args.get("pid"))
    if prob_id == None:
        temp = db.cursor()
        temp.execute("select * from problems")
        lis = temp.fetchall()
        temp.close
        email, password, key = encryptor(email, password)
        url = "?e="+email+"&p="+password+"&k="+key
        return render_template("rearrange_problems_page.html", re_problems=lis, probs_solved = probs, url=url, name= name)
    prob_id = int(prob_id)
    lis = fetch_problem_from_db(prob_id)
    string = lis[-1]
    print(string)
    table = generate_string(string)
    new_table = [list(elem) for elem in table]
    random.shuffle(table)
    for i in range(len(table)):
        elem = table[i]
        table.remove(elem)
        table.insert(i, (i+1, elem))
    question_statement = lis[1]
    question_description = lis[2]
    email, password, key = encryptor(email, password)
    url = "?e="+email+"&p="+password+"&k="+key
    code = secret_code_generator()
    encrypted_code, temp, new_key = encryptor(code, "temp") # using the encrpytor with "temp" as two parameters should be passed
    return render_template("question_page_rearrange.html", table = table, new_table= new_table, question_statement= question_statement, question_description = question_description, go_back_url = url, code = code, encrypted_code = encrypted_code, prob_id = prob_id, new_key= new_key)

#-----------------------------------------------------------------------------------------------------------------------------
#-----------------compiler------------------ 
@app.route("/problems/compiler/")
def main():
    if request.method == "GET":
        return render_template("question_page_compiler.html")
    
@app.route("/problems/compiler/compile/", methods= ["POST"])
def output_code():
    code = request.form["code"]
    output, error = fetch_code_output(code, "temp.py")
    return json.dumps({"output":output, "error":error})
#------------------------------------------------------------------------------------------------------------------------------


@app.route("/problems/dnd/")
def dnd():
    if request.method == "GET":
        return render_template("question_page_drag_and_drop.html")