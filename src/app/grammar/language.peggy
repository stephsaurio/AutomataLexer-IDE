{
  function location() {
    return location();
  }
}

program
  = _ statements:statement* _ {
      return statements;
    }

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
  / addNodeStatement
  / rootStatement
  / leftStatement
  / rightStatement
  / printStatement
  / graphStatement

stackDeclaration
  = "STACK" _ identifier _ ";" _

queueDeclaration
  = "QUEUE" _ identifier _ ";" _

listDeclaration
  = "LIST" _ identifier _ ";" _

hashDeclaration
  = "HASH" _ identifier _ ";" _

treeDeclaration
  = "TREE" _ identifier _ ";" _

pushStatement
  = "PUSH" _ "(" _ identifier _ "," _ value _ ")" _ ";" _

popStatement
  = "POP" _ "(" _ identifier _ ")" _ ";" _

enqueueStatement
  = "ENQUEUE" _ "(" _ identifier _ "," _ value _ ")" _ ";" _

dequeueStatement
  = "DEQUEUE" _ "(" _ identifier _ ")" _ ";" _

insertStatement
  = "INSERT" _ "(" _ identifier _ "," _ value _ ")" _ ";" _

removeStatement
  = "REMOVE" _ "(" _ identifier _ "," _ value _ ")" _ ";" _

setStatement
  = "SET" _ "(" _ identifier _ "," _ value _ "," _ value _ ")" _ ";" _

getStatement
  = "GET" _ "(" _ identifier _ "," _ value _ ")" _ ";" _

addNodeStatement
  = "ADDNODE" _ "(" _ identifier _ "," _ value _ ")" _ ";" _

rootStatement
  = "ROOT" _ "(" _ identifier _ ")" _ ";" _

leftStatement
  = "LEFT" _ "(" _ identifier _ ")" _ ";" _

rightStatement
  = "RIGHT" _ "(" _ identifier _ ")" _ ";" _

printStatement
  = "PRINT" _ "(" _ identifier _ ")" _ ";" _

graphStatement
  = "GRAPH" _ "(" _ identifier _ ")" _ ";" _

value
  = string
  / number
  / identifier

identifier
  = [a-zA-Z_] [a-zA-Z0-9_]*

number
  = [0-9]+

string
  = '"' chars:[^"]* '"' {
      return chars.join("");
    }

_
  = (
      [ \t\r\n]
      / lineComment
      / blockComment
    )*

lineComment
  = "//" [^\n]*

blockComment
  = "/*" chars:(!"*/" .)* "*/" {
      return chars.join("");
    }