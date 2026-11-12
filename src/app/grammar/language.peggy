
{
  //reglas que llaman esta funcion al reconocer cada instruccion
  function statement(kind, values) {
    return Object.assign({ kind }, values);
  }
}

//peggy empieza a leer el programa y devuelve las instrucciones reconocidas
program
  = _ statements:(statement _)* { return statements.map(item => item[0]); }

statement
  = stackDeclaration
  / queueDeclaration
  / listDeclaration
  / hashDeclaration
  / treeDeclaration
  / arrayDeclaration
  / conjuntoDeclaration
  / dequeDeclaration
  / bstDeclaration
  / avlDeclaration
  / heapDeclaration
  / graphListDeclaration
  / graphMatrixDeclaration
  / pushStatement
  / popStatement
  / enqueueStatement
  / dequeueStatement
  / insertStatement
  / removeStatement
  / setStatement
  / getStatement
  / rootStatement
  / leftStatement
  / rightStatement
  / graphStatement
  / consolePopStatement
  / indexStatement
  / addStatement
  / deleteStatement
  / addFrontStatement
  / addBackStatement
  / removeFrontStatement
  / removeBackStatement
  / extractMinStatement
  / vertexStatement
  / edgeStatement
  / removeEdgeStatement

//declaraciones de estructuras
stackDeclaration = "STACK" _ name:identifier _ ";" { return statement("declare", { structure: "STACK", name }); }
queueDeclaration = "QUEUE" _ name:identifier _ ";" { return statement("declare", { structure: "QUEUE", name }); }
listDeclaration  = "LIST" _ name:identifier _ ";" { return statement("declare", { structure: "LIST", name }); }
hashDeclaration  = "HASH" _ name:identifier _ ";" { return statement("declare", { structure: "HASH", name }); }
treeDeclaration  = "TREE" _ name:identifier _ ";" { return statement("declare", { structure: "TREE", name }); }
arrayDeclaration = "ARRAY" _ name:identifier _ ";" { return statement("declare", { structure: "ARRAY", name }); }
conjuntoDeclaration = "CONJUNTO" _ name:identifier _ ";" { return statement("declare", { structure: "CONJUNTO", name }); }
dequeDeclaration = "DEQUE" _ name:identifier _ ";" { return statement("declare", { structure: "DEQUE", name }); }
bstDeclaration = "BST" _ name:identifier _ ";" { return statement("declare", { structure: "BST", name }); }
avlDeclaration = "AVL" _ name:identifier _ ";" { return statement("declare", { structure: "AVL", name }); }
heapDeclaration = "HEAP" _ name:identifier _ ";" { return statement("declare", { structure: "HEAP", name }); }
graphListDeclaration = "GRAPH_LIST" _ name:identifier _ ";" { return statement("declare", { structure: "GRAPH_LIST", name }); }
graphMatrixDeclaration = "GRAPH_MATRIX" _ name:identifier _ ";" { return statement("declare", { structure: "GRAPH_MATRIX", name }); }


//operaciones de las estructuras
pushStatement = "PUSH" _ "(" _ name:identifier _ "," _ value:value _ ")" _ ";" { return statement("PUSH", { name, value }); }
popStatement = "POP" _ "(" _ name:identifier _ ")" _ ";" { return statement("POP", { name }); }

enqueueStatement = "ENQUEUE" _ "(" _ name:identifier _ "," _ value:value _ ")" _ ";" { return statement("ENQUEUE", { name, value }); }
dequeueStatement = "DEQUEUE" _ "(" _ name:identifier _ ")" _ ";" { return statement("DEQUEUE", { name }); }

insertStatement = "INSERT" _ "(" _ name:identifier _ "," _ value:value _ ")" _ ";" { return statement("INSERT", { name, value }); }
removeStatement = "REMOVE" _ "(" _ name:identifier _ "," _ value:value _ ")" _ ";" { return statement("REMOVE", { name, value }); }

setStatement = "SET" _ "(" _ name:identifier _ "," _ key:value _ "," _ value:value _ ")" _ ";" { return statement("SET", { name, key, value }); }
getStatement = "GET" _ "(" _ name:identifier _ "," _ key:value _ ")" _ ";" { return statement("GET", { name, key }); }

rootStatement = "ROOT" _ "(" _ name:identifier _ "," _ value:value _ ")" _ ";" { return statement("ROOT", { name, value }); }
leftStatement = "LEFT" _ "(" _ name:identifier _ "," _ parent:value _ "," _ value:value _ ")" _ ";" { return statement("LEFT", { name, parent, value }); }
rightStatement = "RIGHT" _ "(" _ name:identifier _ "," _ parent:value _ "," _ value:value _ ")" _ ";" { return statement("RIGHT", { name, parent, value }); }

graphStatement = "GRAPH" _ "(" _ name:identifier _ ")" _ ";" { return statement("GRAPH", { name }); }
consolePopStatement = "CONSOLE POP" _ "(" _ name:identifier _ ")" _ ";" { return statement("CONSOLE_POP", { name }); }
indexStatement = "INDEX" _ "(" _ name:identifier _ "," _ index:number _ "," _ value:value _ ")" _ ";" { return statement("INDEX", { name, index: Number(index), value }); }

addStatement = "ADD" _ "(" _ name:identifier _ "," _ value:value _ ")" _ ";" { return statement("ADD", { name, value }); }
deleteStatement = "DELETE" _ "(" _ name:identifier _ "," _ value:value _ ")" _ ";" { return statement("DELETE", { name, value }); }

addFrontStatement = "ADD_FRONT" _ "(" _ name:identifier _ "," _ value:value _ ")" _ ";" { return statement("ADD_FRONT", { name, value }); }
addBackStatement = "ADD_BACK" _ "(" _ name:identifier _ "," _ value:value _ ")" _ ";" { return statement("ADD_BACK", { name, value }); }

removeFrontStatement = "REMOVE_FRONT" _ "(" _ name:identifier _ ")" _ ";" { return statement("REMOVE_FRONT", { name }); }
removeBackStatement = "REMOVE_BACK" _ "(" _ name:identifier _ ")" _ ";" { return statement("REMOVE_BACK", { name }); }

extractMinStatement = "EXTRACT_MIN" _ "(" _ name:identifier _ ")" _ ";" { return statement("EXTRACT_MIN", { name }); }
vertexStatement = "VERTEX" _ "(" _ name:identifier _ "," _ value:value _ ")" _ ";" { return statement("ADD_VERTEX", { name, value }); }

edgeStatement = "EDGE" _ "(" _ name:identifier _ "," _ parent:value _ "," _ value:value _ ")" _ ";" { return statement("ADD_EDGE", { name, parent, value }); }
removeEdgeStatement = "REMOVE_EDGE" _ "(" _ name:identifier _ "," _ parent:value _ "," _ value:value _ ")" _ ";" { return statement("REMOVE_EDGE", { name, parent, value }); }

//valores permitidos
value = string / number / identifier

//identificadores
identifier = $([a-zA-Z_] [a-zA-Z0-9_]*)

//numeros
number = digits:[0-9]+ { return digits.join(""); }

//cadenas de texto
string = "\"" chars:[^"]* "\"" { return chars.join(""); }

//ignora espacios y comentarios
_
  = ([ \t\r\n] / lineComment / blockComment)*

lineComment = "//" [^\n]*
blockComment = "/*" (!"*/" .)* "*/"
