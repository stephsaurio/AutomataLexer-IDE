{
  function statement(kind, values) {
    return Object.assign({ kind }, values);
  }
}

program
  = _ statements:(statement _)* { return statements.map(item => item[0]); }

statement
  = stackDeclaration
  / queueDeclaration
  / listDeclaration
  / hashDeclaration
  / treeDeclaration
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

stackDeclaration = "STACK" _ name:identifier _ ";" { return statement("declare", { structure: "STACK", name }); }
queueDeclaration = "QUEUE" _ name:identifier _ ";" { return statement("declare", { structure: "QUEUE", name }); }
listDeclaration  = "LIST" _ name:identifier _ ";" { return statement("declare", { structure: "LIST", name }); }
hashDeclaration  = "HASH" _ name:identifier _ ";" { return statement("declare", { structure: "HASH", name }); }
treeDeclaration  = "TREE" _ name:identifier _ ";" { return statement("declare", { structure: "TREE", name }); }

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

value = string / number / identifier
identifier = $([a-zA-Z_] [a-zA-Z0-9_]*)
number = digits:[0-9]+ { return digits.join(""); }
string = '"' chars:[^"]* '"' { return chars.join(""); }
_
  = ([ \t\r\n] / lineComment / blockComment)*
lineComment = "//" [^\n]*
blockComment = "/*" (!"*/" .)* "*/"
