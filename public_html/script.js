function getEl(id){
    return document.getElementById(id);
}
function getElValue(id){
    return getEl(id).value;
}
function setElValue(id, value){
    getEl(id).value=value;
}
function setElHTML(id, value){
    getEl(id).innerHTML=value;
}
function validateForm(){
    let msg = getEl("msg");
    let fields = document.getElementsByClassName("checkNotNull");

    for(let f of fields){
        if(f.value === ""){
           let label = document.querySelector(`[for="${f.id}"]`);
            msg.innerHTML =`${label.innerText} -> это поле не может быть пустым`;
            throw new Error("bad validate");
        }
    }
}
function readForm(){
    return {
        author:getElValue("author"),
        name:getElValue("name"),
        genre:getElValue("genre"),
        countPages:getElValue("countPages")
    };
}
function addBookToDB() {
    validateForm();
   addBook(readForm());
}
let booksIdCounter=0;
let booksTable=getEl("booksTable");
let saveButton=getEl('butForm');
let butCancle=getEl('butCancle');
let currentEditBook=null;
function editBook(book){
        currentEditBook=book;
        setElValue('author',book.author);
        setElValue('name',book.name);
        setElValue('genre',book.genre);
        setElValue('countPages',book.countPages);
        saveButton.innerHTML="Сохранить";
        butCancle.style.display="block";
        saveButton.removeEventListener('click',addBookToDB);
        saveButton.addEventListener('click',saveBook);
}
function cancleEdit(){
        currentEditBook=null;
        saveButton.innerHTML="Добавить";
        butCancle.style.display="none";
        saveButton.removeEventListener('click',saveBook);
        saveButton.addEventListener('click',addBookToDB);
        clearForm();
}
function saveBook(){
        let id=currentEditBook.id;
        setElHTML("rvAuthor"+id,getElValue("author"));
        setElHTML("rvName"+id,getElValue("name"));
        setElHTML("rvGenre"+id,getElValue("genre"));
        setElHTML("rvCountPages"+id,getElValue("countPages"));
        localStorage.setItem("book"+id, JSON.stringify( currentEditBook));
        cancleEdit();
}
function clearForm(){
    let fields = document.getElementsByClassName("checkNotNull");
    for(let f of fields){
        f.value="";
    }
}
function addBook(book){
    let bookId=booksIdCounter++;
    book.id=bookId;
    let bookRow=document.createElement("tr");
    localStorage.setItem("book"+bookId, JSON.stringify(book));
    console.log(book);
    bookRow.innerHTML= `
            <td>
            <span id="rvAuthor${bookId}">${book.author}</span><br>
            <span id="rvName${bookId}">${book.name}</span><br>
            <span id="rvGenre${bookId}">${book.genre}</span><br>
            <span id="rvCountPages${bookId}">${book.countPages}</span><br>
            </td>
            <td>
                <input type="button" id="buttonDelete${bookId}" value="&#10005" style="width:50px; height=20px"><br>
                <input type="button" id="buttonEdit${bookId}" value="&#9998" style="width:50px; height=20px">
            </td>
`;
    booksTable.appendChild(bookRow);
    getEl("buttonDelete"+bookId).addEventListener('click',()=>{
         booksTable.removeChild(bookRow);
         cancleEdit();
    });
    getEl("buttonEdit"+bookId).addEventListener('click',()=>{
        editBook(book);
    });
    clearForm();
}
saveButton.addEventListener('click',addBookToDB);
butCancle.addEventListener('click',cancleEdit);