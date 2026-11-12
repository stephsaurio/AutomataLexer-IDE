{
  //guarda el estado de las estructuras mientras se lee el programa
  const structures = new Map();
  //cada GRAPH agrega el DOT que despues se muestra en la pantalla
  const graphs = [];
  const consoleMessages = [];

  //reglas que llaman esta funcion al reconocer cada instruccion
  function statement(kind, values) {
    const result = Object.assign({ kind }, values);
    execute(result);
    return result;
  }

  //aplica la operacion reconocida a la estructura que corresponde
  function execute(item) {
    if (item.kind === "declare") {
      //al declarar se crea el espacio inicial segun el tipo de estructura.
      const structure = { kind: item.structure };
      if (item.structure === "HASH") structure.values = new Map();
      else if (item.structure === "TREE") structure.root = null;
      else structure.values = [];
      structures.set(item.name, structure);
      return;
    }

    const structure = structures.get(item.name);
    if (!structure) {
      if (item.kind === "CONSOLE_POP") {
        consoleMessages.push(`No existe la estructura ${item.name}.`);
      }
      return;
    }

    if (item.kind === "CONSOLE_POP") {
      if (structure.kind !== "STACK") {
        consoleMessages.push(`${item.name} no es una pila.`);
        return;
      }

      const removedValue = structure.values.pop();
      consoleMessages.push(
        removedValue === undefined
          ? `${item.name}: pila vacía`
          : `${item.name}: ${removedValue}`,
      );
      return;
    }

    if (item.kind === "GRAPH") {
      //la grafica se guarda en este momento, con el estado actual
      graphs.push({ name: item.name, dot: toDot(structure) });
      return;
    }

    if (structure.kind === "HASH") {
      if (item.kind === "SET") structure.values.set(item.key, item.value);
      if (item.kind === "GET") structure.values.delete(item.key);
      return;
    }

    if (structure.kind === "ARRAY") {
      if (item.kind === "INDEX") structure.values[item.index] = item.value;
      return;
    }

    if (structure.kind === "TREE") {
      if (item.kind === "ROOT") structure.root = { value: item.value };
      else if (structure.root && (item.kind === "LEFT" || item.kind === "RIGHT")) {
        const parent = findNode(structure.root, item.parent);
        if (parent) parent[item.kind === "LEFT" ? "left" : "right"] = { value: item.value };
      }
      return;
    }

    if (item.kind === "PUSH" || item.kind === "ENQUEUE" || item.kind === "INSERT") {
      structure.values.push(item.value);
    } else if (item.kind === "POP" && structure.kind === "STACK") {
      structure.values.pop();
    } else if (item.kind === "DEQUEUE" && structure.kind === "QUEUE") {
      structure.values.shift();
    } else if (item.kind === "REMOVE" && structure.kind === "LIST") {
      const index = structure.values.indexOf(item.value);
      
      if (index >= 0) structure.values.splice(index, 1);
    }
  }

  //busca el nodo por su valor para poder agregarle un hijo al arbol
  function findNode(node, value) {
    if (node.value === value) return node;
    return (node.left && findNode(node.left, value)) || (node.right && findNode(node.right, value));
  }

  //convierte los datos de una estructura en instrucciones DOT
  function toDot(structure) {
    const lines = [`digraph ${graphName(structure.kind)} {`];
    const addNodes = values => values.forEach((value, index) => {
      lines.push(`n${index + 1} [label="${escape(value)}"];`);
    });

    if (structure.kind === "STACK") {
      lines.push("rankdir=TB;");
      const values = [...structure.values].reverse();
      addNodes(values);
      values.slice(1).forEach((_, index) => lines.push(`n${index + 1} -> n${index + 2};`));
      if (!values.length) lines.push('empty [label="empty"];');
    } else if (structure.kind === "QUEUE" || structure.kind === "LIST") {
      lines.push("rankdir=LR;");
      addNodes(structure.values);
      structure.values.slice(1).forEach((_, index) => {
        lines.push(`n${index + 1} -> n${index + 2};`);
        if (structure.kind === "LIST") lines.push(`n${index + 2} -> n${index + 1};`);
      });
      if (!structure.values.length) lines.push('empty [label="empty"];');
    } else if (structure.kind === "ARRAY") {
      lines.push("rankdir=LR;");
      const values = structure.values.filter(value => value !== undefined);
      addNodes(values);
      values.slice(1).forEach((_, index) => lines.push(`n${index + 1} -> n${index + 2};`));
      if (!values.length) lines.push('empty [label="empty"];');
    } else if (structure.kind === "HASH") {
      lines.push("node [shape=record];");
      const entries = [...structure.values.entries()];
      const rows = entries.map(([key, value]) => `{${escapeRecord(key)}|${escapeRecord(value)}}`);
      lines.push(`tabla [label="${rows.length ? rows.join("|") : "{empty}"}"];`);
    } else if (structure.root) {
      addTreeNodes(lines, structure.root, { value: 0 });
    } else {
      lines.push('empty [label="empty"];');
    }

    return [...lines, "}"].join("\n");
  }

  //recorre el arbol y escribe sus nodos y conexiones en DOT
  function addTreeNodes(lines, node, sequence) {
    const id = `n${++sequence.value}`;
    lines.push(`${id} [label="${escape(node.value)}"];`);
    for (const child of [node.left, node.right]) {
      if (!child) continue;
      const childId = `n${sequence.value + 1}`;
      lines.push(`${id} -> ${childId};`);
      addTreeNodes(lines, child, sequence);
    }
  }

  //usae un nombre corto para el tipo de grafo que se genera
  function graphName(kind) {
    return ({ STACK: "Stack", QUEUE: "Queue", LIST: "Lista", HASH: "HashTable", TREE: "Tree", ARRAY: "Array", })[kind];
  }

  //limpia caracteres que pueden romper las etiquetas de DOT
  function escape(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
  }

  //en las tablas hash tambien hay que limpiar separadores de record
  function escapeRecord(value) {
    return escape(value).replace(/[{}|<>]/g, "\\$&");
  }
}

//peggy empieza a leer por program y devuelve las graficas que se piden
program
  = _ statements:(statement _)* { return { graphs, consoleMessages }; }

statement
  = stackDeclaration
  / queueDeclaration
  / listDeclaration
  / hashDeclaration
  / treeDeclaration
  / arrayDeclaration
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
  


stackDeclaration = "STACK" _ name:identifier _ ";" { return statement("declare", { structure: "STACK", name }); }
queueDeclaration = "QUEUE" _ name:identifier _ ";" { return statement("declare", { structure: "QUEUE", name }); }
listDeclaration  = "LIST" _ name:identifier _ ";" { return statement("declare", { structure: "LIST", name }); }
hashDeclaration  = "HASH" _ name:identifier _ ";" { return statement("declare", { structure: "HASH", name }); }
treeDeclaration  = "TREE" _ name:identifier _ ";" { return statement("declare", { structure: "TREE", name }); }
arrayDeclaration  = "ARRAY" _ name:identifier _ ";" { return statement("declare", { structure: "ARRAY", name }); }


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

value = string / number / identifier
identifier = $([a-zA-Z_] [a-zA-Z0-9_]*)
number = digits:[0-9]+ { return digits.join(""); }
string = "\"" chars:[^"]* "\"" { return chars.join(""); }
_
  = ([ \t\r\n] / lineComment / blockComment)*
lineComment = "//" [^\n]*
blockComment = "/*" (!"*/" .)* "*/"
