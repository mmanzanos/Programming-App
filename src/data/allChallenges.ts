import { Exercise, LanguageId } from '../types';

// Helper to construct a level item
function createLevel(
  lang: LanguageId,
  num: number,
  chapter: string,
  title: string,
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado',
  xp: number,
  instructions: string,
  explanation: string,
  marcTip: string,
  starterCode: string,
  solutionCode: string,
  mobileTokens: string[],
  testOutput: string,
  testFn: (code: string, logs: string[]) => { passed: boolean; message?: string },
  hints: string[]
): Exercise {
  return {
    id: `${lang}-lvl-${num}`,
    lessonId: `${lang}-ch-${Math.ceil(num / 6)}`,
    languageId: lang,
    levelNumber: num,
    chapterTitle: chapter,
    title: `Nivel ${num}: ${title}`,
    difficulty,
    xpReward: xp,
    instructions,
    explanation,
    marcTip,
    starterCode,
    solutionCode,
    mobileTokens,
    hints,
    testCases: [
      {
        id: `${lang}-t-${num}`,
        description: `Comprobación del Nivel ${num}`,
        expectedOutput: testOutput,
        testFn
      }
    ]
  };
}

// ==========================================
// 1. PYTHON (30 NIVELES)
// ==========================================
export const PYTHON_LEVELS: Exercise[] = [
  createLevel('python', 1, 'Fundamentos', 'Hola Mundo', 'Principiante', 20,
    'Escribe `mensaje = "¡Hola, Marc!"` y muéstralo con `print(mensaje)`.',
    'La función print() muestra datos en pantalla.', '¡Tu primer paso en el mundo de la programación!',
    'mensaje = \nprint()', 'mensaje = "¡Hola, Marc!"\nprint(mensaje)',
    ['mensaje', '=', '"¡Hola, Marc!"', 'print(mensaje)'], '¡Hola, Marc!',
    (c, l) => ({ passed: l.some(x => /hola.*marc/i.test(x)) }), ['Asigna la variable con comillas', 'Pásala a print(mensaje)']),

  createLevel('python', 2, 'Fundamentos', 'Variables Numéricas', 'Principiante', 25,
    'Declara `edad = 25` e imprímela con `print(edad)`.',
    'Las variables numéricas no llevan comillas.', 'En Python no necesitas especificar int o float manualmente.',
    'edad = \nprint()', 'edad = 25\nprint(edad)',
    ['edad', '=', '25', 'print(edad)'], '25',
    (c, l) => ({ passed: l.some(x => x.trim() === '25') }), ['Escribe edad = 25', 'Luego print(edad)']),

  createLevel('python', 3, 'Fundamentos', 'Suma de Números', 'Principiante', 25,
    'Calcula `suma = 15 + 35` y muestra `suma` con `print(suma)`.',
    'El operador + suma números en Python.', 'Las operaciones matemáticas siguen el orden estándar.',
    'suma = \nprint(suma)', 'suma = 15 + 35\nprint(suma)',
    ['suma', '=', '15', '+', '35', 'print(suma)'], '50',
    (c, l) => ({ passed: l.some(x => x.trim() === '50') }), ['Escribe suma = 15 + 35', 'Usa print(suma)']),

  createLevel('python', 4, 'Fundamentos', 'Resta de Precios', 'Principiante', 25,
    'Declara `precio = 100` y `descuento = 20`. Calcula `total = precio - descuento` e imprímelo.',
    'La resta usa el operador -.', 'Mantén nombres de variables descriptivos.',
    'precio = 100\ndescuento = 20\ntotal = \nprint(total)', 'precio = 100\ndescuento = 20\ntotal = precio - descuento\nprint(total)',
    ['total = precio - descuento', 'print(total)', '80'], '80',
    (c, l) => ({ passed: l.some(x => x.trim() === '80') }), ['total = precio - descuento', 'print(total)']),

  createLevel('python', 5, 'Fundamentos', 'Multiplicación y Área', 'Principiante', 25,
    'Calcula el área de un rectángulo: `base = 8`, `altura = 5`, `area = base * altura`. Imprime `area`.',
    'El operador * se usa para la multiplicación.', 'Los asteriscos simples multiplican; doble asterisco ** es potencia.',
    'base = 8\naltura = 5\n', 'base = 8\naltura = 5\narea = base * altura\nprint(area)',
    ['area = base * altura', 'print(area)', '40', '*'], '40',
    (c, l) => ({ passed: l.some(x => x.trim() === '40') }), ['Multiplica base * altura']),

  createLevel('python', 6, 'Fundamentos', 'División Decimal', 'Principiante', 30,
    'Divide `resultado = 50 / 2` e imprime `resultado`.',
    'La división con / siempre produce un número decimal (float).', 'Si necesitas división entera sin decimales, usarías //.',
    'resultado = \nprint(resultado)', 'resultado = 50 / 2\nprint(resultado)',
    ['resultado = 50 / 2', 'print(resultado)', '25.0'], '25',
    (c, l) => ({ passed: l.some(x => x.includes('25')) }), ['Escribe 50 / 2']),

  createLevel('python', 7, 'Control de Flujo', 'Condicional if Básico', 'Principiante', 30,
    'Si `nota = 8`, escribe `if nota >= 5:` e imprime `"Aprobado"`.',
    'El bloque if se ejecuta sólo si la condición es verdadera.', 'No olvides los dos puntos : al final.',
    'nota = 8\nif nota >= 5:\n    ', 'nota = 8\nif nota >= 5:\n    print("Aprobado")',
    ['if nota >= 5:', '    print("Aprobado")', 'nota'], 'Aprobado',
    (c, l) => ({ passed: l.some(x => /aprobado/i.test(x)) }), ['Escribe print("Aprobado") indentado']),

  createLevel('python', 8, 'Control de Flujo', 'Estructura if/else', 'Principiante', 30,
    'Dado `saldo = 50`, si `saldo > 0` imprime `"Con saldo"`, si no, `"Sin saldo"`.',
    'else se ejecuta cuando el if es falso.', 'El bloque else también debe terminar con dos puntos.',
    'saldo = 50\nif saldo > 0:\n    print("Con saldo")\nelse:\n    ', 'saldo = 50\nif saldo > 0:\n    print("Con saldo")\nelse:\n    print("Sin saldo")',
    ['else:', '    print("Sin saldo")', 'saldo'], 'Con saldo',
    (c, l) => ({ passed: l.some(x => /con saldo/i.test(x)) }), ['Completa el else con print']),

  createLevel('python', 9, 'Control de Flujo', 'Comparador de Igualdad ==', 'Principiante', 30,
    'Dado `usuario = "Marc"`, si `usuario == "Marc"` imprime `"Bienvenido Mentor"`.',
    'El doble igual == compara igualdad; el simple = asigna.', '¡Cuidado con no confundir = con ==!',
    'usuario = "Marc"\nif usuario == "Marc":\n    ', 'usuario = "Marc"\nif usuario == "Marc":\n    print("Bienvenido Mentor")',
    ['if usuario == "Marc":', '    print("Bienvenido Mentor")', '=='], 'Bienvenido Mentor',
    (c, l) => ({ passed: l.some(x => /bienvenido mentor/i.test(x)) }), ['Usa == para comparar']),

  createLevel('python', 10, 'Control de Flujo', 'Operador Lógico and', 'Intermedio', 35,
    'Dados `edad = 22` y `tiene_carnet = True`. Si `edad >= 18 and tiene_carnet:`, imprime `"Puede conducir"`.',
    'and requiere que ambas condiciones sean verdaderas.', 'Combina múltiples expresiones lógicas fácilmente.',
    'edad = 22\ntiene_carnet = True\nif edad >= 18 and tiene_carnet:\n    ', 'edad = 22\ntiene_carnet = True\nif edad >= 18 and tiene_carnet:\n    print("Puede conducir")',
    ['if edad >= 18 and tiene_carnet:', '    print("Puede conducir")', 'and'], 'Puede conducir',
    (c, l) => ({ passed: l.some(x => /puede conducir/i.test(x)) }), ['Imprime "Puede conducir"']),

  createLevel('python', 11, 'Control de Flujo', 'Operador Lógico or', 'Intermedio', 35,
    'Si `es_sabado = True` o `es_domingo = False`. Si `es_sabado or es_domingo:`, imprime `"Fin de semana"`.',
    'or es verdadero si al menos una de las condiciones lo es.', 'Muy útil para verificar opciones alternativas.',
    'es_sabado = True\nes_domingo = False\nif es_sabado or es_domingo:\n    ', 'es_sabado = True\nes_domingo = False\nif es_sabado or es_domingo:\n    print("Fin de semana")',
    ['if es_sabado or es_domingo:', '    print("Fin de semana")', 'or'], 'Fin de semana',
    (c, l) => ({ passed: l.some(x => /fin de semana/i.test(x)) }), ['Imprime "Fin de semana"']),

  createLevel('python', 12, 'Control de Flujo', 'Bucle for con range()', 'Intermedio', 35,
    'Usa `for i in [1, 2, 3]:` e imprime cada número `i`.',
    'El bucle for itera sobre cada elemento de una secuencia.', 'Cada ciclo avanza automáticamente.',
    'for i in [1, 2, 3]:\n    ', 'for i in [1, 2, 3]:\n    print(i)',
    ['for i in [1, 2, 3]:', '    print(i)', 'i'], '1 2 3',
    (c, l) => ({ passed: l.length >= 3 && l.some(x => x.includes('1')) }), ['Imprime i en cada vuelta']),

  createLevel('python', 13, 'Listas y Colecciones', 'Crear una Lista', 'Principiante', 35,
    'Crea `lenguajes = ["Python", "Rust"]` e imprime la lista con `print(lenguajes)`.',
    'Las listas se definen entre corchetes [] y están ordenadas.', 'Pueden almacenar cualquier tipo de dato.',
    'lenguajes = \nprint(lenguajes)', 'lenguajes = ["Python", "Rust"]\nprint(lenguajes)',
    ['lenguajes = ["Python", "Rust"]', 'print(lenguajes)', '["Python", "Rust"]'], 'Python',
    (c, l) => ({ passed: l.some(x => x.includes('Python')) }), ['Crea la lista entre corchetes']),

  createLevel('python', 14, 'Listas y Colecciones', 'Primer Elemento de una Lista', 'Principiante', 35,
    'Dada `frutas = ["Manzana", "Pera"]`, imprime el primer elemento `print(frutas[0])`.',
    'Los índices en Python empiezan en 0.', 'El primer elemento siempre está en [0].',
    'frutas = ["Manzana", "Pera"]\nprint()', 'frutas = ["Manzana", "Pera"]\nprint(frutas[0])',
    ['print(frutas[0])', 'frutas[0]', '0'], 'Manzana',
    (c, l) => ({ passed: l.some(x => /manzana/i.test(x)) }), ['Accede con [0]']),

  createLevel('python', 15, 'Listas y Colecciones', 'Recorrer Lista con for', 'Intermedio', 40,
    'Dada `paises = ["España", "México"]`, recorre con `for p in paises:` e imprime cada país.',
    'La variable p toma el valor de cada elemento secuencialmente.', 'No necesitas contador manual.',
    'paises = ["España", "México"]\nfor p in paises:\n    ', 'paises = ["España", "México"]\nfor p in paises:\n    print(p)',
    ['for p in paises:', '    print(p)', 'p'], 'España México',
    (c, l) => ({ passed: l.some(x => /españa/i.test(x)) && l.some(x => /méxico|mexico/i.test(x)) }), ['Escribe print(p)']),

  createLevel('python', 16, 'Listas y Colecciones', 'Diccionario Clave-Valor', 'Intermedio', 40,
    'Crea `alumno = {"nombre": "Marc", "curso": "Python"}` e imprime `print(alumno["nombre"])`.',
    'Los diccionarios asocian claves con valores usando llaves {}.', 'Accede a un valor indicando su clave entre corchetes.',
    'alumno = {"nombre": "Marc", "curso": "Python"}\nprint()', 'alumno = {"nombre": "Marc", "curso": "Python"}\nprint(alumno["nombre"])',
    ['print(alumno["nombre"])', 'alumno["nombre"]', '"nombre"'], 'Marc',
    (c, l) => ({ passed: l.some(x => /marc/i.test(x)) }), ['Accede a alumno["nombre"]']),

  createLevel('python', 17, 'Listas y Colecciones', 'Acceder a Clave de Diccionario', 'Intermedio', 40,
    'Dado `coche = {"marca": "Tesla", "año": 2024}`, imprime `print(coche["marca"])`.',
    'Las claves suelen ser cadenas de texto representativas.', 'Estructura esencial para APIs y JSON.',
    'coche = {"marca": "Tesla", "año": 2024}\nprint()', 'coche = {"marca": "Tesla", "año": 2024}\nprint(coche["marca"])',
    ['print(coche["marca"])', 'coche["marca"]', '"Tesla"'], 'Tesla',
    (c, l) => ({ passed: l.some(x => /tesla/i.test(x)) }), ['Imprime coche["marca"]']),

  createLevel('python', 18, 'Listas y Colecciones', 'Lista de Números', 'Intermedio', 40,
    'Crea `numeros = [10, 20, 30]` y muestra el último elemento `print(numeros[2])`.',
    'El tercer elemento tiene índice 2.', 'En Python también puedes usar índice negativo [-1] para el último.',
    'numeros = [10, 20, 30]\nprint()', 'numeros = [10, 20, 30]\nprint(numeros[2])',
    ['print(numeros[2])', 'numeros[2]', '30'], '30',
    (c, l) => ({ passed: l.some(x => x.trim() === '30') }), ['Accede con numeros[2]']),

  createLevel('python', 19, 'Funciones', 'Definir una Función', 'Intermedio', 45,
    'Crea `def saludar(): return "Hola desde la función"`. Llama con `print(saludar())`.',
    'def declara una función reutilizable.', 'return devuelve el resultado al código que la invocó.',
    'def saludar():\n    return "Hola desde la función"\nprint(saludar())', 'def saludar():\n    return "Hola desde la función"\nprint(saludar())',
    ['def saludar():', '    return "Hola desde la función"', 'print(saludar())'], 'Hola desde la función',
    (c, l) => ({ passed: l.some(x => /hola desde la función/i.test(x)) }), ['Llama a print(saludar())']),

  createLevel('python', 20, 'Funciones', 'Función con Parámetro', 'Intermedio', 45,
    'Escribe `def bienvenida(nombre): return f"Hola {nombre}"`. Imprime `bienvenida("Marc")`.',
    'Los parámetros reciben argumentos al llamar a la función.', 'Usa f-strings para formatear texto fácilmente.',
    'def bienvenida(nombre):\n    return f"Hola {nombre}"\nprint(bienvenida("Marc"))', 'def bienvenida(nombre):\n    return f"Hola {nombre}"\nprint(bienvenida("Marc"))',
    ['def bienvenida(nombre):', '    return f"Hola {nombre}"', 'print(bienvenida("Marc"))'], 'Hola Marc',
    (c, l) => ({ passed: l.some(x => /hola marc/i.test(x)) }), ['Pasa "Marc" a la función']),

  createLevel('python', 21, 'Funciones', 'Función de Suma', 'Intermedio', 45,
    'Define `def sumar(a, b): return a + b`. Imprime `print(sumar(20, 30))`.',
    'Las funciones pueden recibir múltiples parámetros separados por coma.', 'Escribe código modular y limpio.',
    'def sumar(a, b):\n    return a + b\nprint(sumar(20, 30))', 'def sumar(a, b):\n    return a + b\nprint(sumar(20, 30))',
    ['def sumar(a, b):', '    return a + b', 'print(sumar(20, 30))'], '50',
    (c, l) => ({ passed: l.some(x => x.trim() === '50') }), ['Retorna a + b']),

  createLevel('python', 22, 'Funciones', 'Función Multiplicar', 'Intermedio', 45,
    'Crea `def multiplicar(x, y): return x * y`. Imprime `print(multiplicar(6, 7))`.',
    'Reutiliza funciones matemáticas siempre que lo necesites.', 'Ideal para cálculos financieros o de juegos.',
    'def multiplicar(x, y):\n    return x * y\nprint(multiplicar(6, 7))', 'def multiplicar(x, y):\n    return x * y\nprint(multiplicar(6, 7))',
    ['def multiplicar(x, y):', '    return x * y', 'print(multiplicar(6, 7))'], '42',
    (c, l) => ({ passed: l.some(x => x.trim() === '42') }), ['Calcula 6 * 7']),

  createLevel('python', 23, 'Funciones', 'Función Es Mayor de Edad', 'Intermedio', 45,
    'Crea `def es_mayor(edad): return edad >= 18`. Imprime `print(es_mayor(20))`.',
    'Las funciones pueden devolver valores booleanos True o False.', 'Muy útiles como predicados lógicos.',
    'def es_mayor(edad):\n    return edad >= 18\nprint(es_mayor(20))', 'def es_mayor(edad):\n    return edad >= 18\nprint(es_mayor(20))',
    ['def es_mayor(edad):', '    return edad >= 18', 'print(es_mayor(20))'], 'True',
    (c, l) => ({ passed: l.some(x => /true/i.test(x)) }), ['Retorna edad >= 18']),

  createLevel('python', 24, 'Funciones', 'Función con Parámetro por Defecto', 'Intermedio', 50,
    'Define `def saludar_rol(rol="Estudiante"): return f"Rol: {rol}"`. Imprime `print(saludar_rol())`.',
    'Los parámetros por defecto evitan errores si no se envía argumento.', 'Asigna un valor predeterminado con =.',
    'def saludar_rol(rol="Estudiante"):\n    return f"Rol: {rol}"\nprint(saludar_rol())', 'def saludar_rol(rol="Estudiante"):\n    return f"Rol: {rol}"\nprint(saludar_rol())',
    ['def saludar_rol(rol="Estudiante"):', '    return f"Rol: {rol}"', 'print(saludar_rol())'], 'Rol: Estudiante',
    (c, l) => ({ passed: l.some(x => /rol: estudiante/i.test(x)) }), ['Ejecuta sin argumentos']),

  createLevel('python', 25, 'Retos Prácticos', 'Calculadora de Descuentos', 'Avanzado', 50,
    'Escribe `def aplicar_descuento(precio, pct): return precio - (precio * pct / 100)`. Imprime `print(aplicar_descuento(200, 10))`.',
    'Combina operaciones y porcentajes en una función práctica.', 'Calcula el 10% de 200 restado al precio.',
    'def aplicar_descuento(precio, pct):\n    return precio - (precio * pct / 100)\nprint(aplicar_descuento(200, 10))', 'def aplicar_descuento(precio, pct):\n    return precio - (precio * pct / 100)\nprint(aplicar_descuento(200, 10))',
    ['def aplicar_descuento(precio, pct):', 'return precio - (precio * pct / 100)', 'print(aplicar_descuento(200, 10))'], '180',
    (c, l) => ({ passed: l.some(x => x.includes('180')) }), ['El resultado debe ser 180']),

  createLevel('python', 26, 'Retos Prácticos', 'Calcular Total con Impuestos', 'Avanzado', 50,
    'Crea `def total_con_iva(subtotal): return subtotal * 1.21`. Imprime `print(total_con_iva(100))`.',
    'El IVA al 21% se calcula multiplicando por 1.21.', 'Aplica lógica real de software comercial.',
    'def total_con_iva(subtotal):\n    return subtotal * 1.21\nprint(total_con_iva(100))', 'def total_con_iva(subtotal):\n    return subtotal * 1.21\nprint(total_con_iva(100))',
    ['def total_con_iva(subtotal):', '    return subtotal * 1.21', 'print(total_con_iva(100))'], '121',
    (c, l) => ({ passed: l.some(x => x.includes('121')) }), ['Multiplica subtotal * 1.21']),

  createLevel('python', 27, 'Retos Prácticos', 'Filtrar Números Pares', 'Avanzado', 55,
    'Crea `numeros = [1, 2, 3, 4]`. Recórrelos y si `n % 2 == 0` imprime `n`.',
    'El operador % calcula el residuo. Si es 0, el número es par.', 'Algoritmo clásico de filtrado.',
    'numeros = [1, 2, 3, 4]\nfor n in numeros:\n    if n % 2 == 0:\n        print(n)', 'numeros = [1, 2, 3, 4]\nfor n in numeros:\n    if n % 2 == 0:\n        print(n)',
    ['if n % 2 == 0:', '    print(n)', 'for n in numeros:'], '2 4',
    (c, l) => ({ passed: l.some(x => x.includes('2')) && l.some(x => x.includes('4')) }), ['Filtra los números pares']),

  createLevel('python', 28, 'Retos Prácticos', 'Contador de Racha de Estudio', 'Avanzado', 55,
    'Dado `racha = 6`, incrementa `racha = racha + 1` e imprime `f"Racha: {racha} días"`.',
    'Los contadores aumentan en cada sesión de práctica.', '¡La constancia es la clave del éxito!',
    'racha = 6\nracha = racha + 1\nprint(f"Racha: {racha} días")', 'racha = 6\nracha = racha + 1\nprint(f"Racha: {racha} días")',
    ['racha = racha + 1', 'print(f"Racha: {racha} días")', 'racha'], 'Racha: 7 días',
    (c, l) => ({ passed: l.some(x => /racha:\s*7/i.test(x)) }), ['Incrementa la racha a 7']),

  createLevel('python', 29, 'Retos Prácticos', 'Generador de Mensaje de Nivel', 'Avanzado', 60,
    'Define `def subir_nivel(nivel): return f"¡Nivel {nivel + 1} desbloqueado!"`. Imprime `print(subir_nivel(4))`.',
    'Construye textos dinámicos con f-strings para retroalimentar al usuario.', 'Gamificación en acción.',
    'def subir_nivel(nivel):\n    return f"¡Nivel {nivel + 1} desbloqueado!"\nprint(subir_nivel(4))', 'def subir_nivel(nivel):\n    return f"¡Nivel {nivel + 1} desbloqueado!"\nprint(subir_nivel(4))',
    ['def subir_nivel(nivel):', 'return f"¡Nivel {nivel + 1} desbloqueado!"', 'print(subir_nivel(4))'], '¡Nivel 5 desbloqueado!',
    (c, l) => ({ passed: l.some(x => /nivel 5/i.test(x)) }), ['Debe mostrar nivel 5']),

  createLevel('python', 30, 'Proyecto Final', 'Graduación Python con Marc', 'Avanzado', 100,
    'Crea `def graduado(): return "¡Felicidades! Has completado los 30 niveles de Python con Marc"`. Imprime `print(graduado())`.',
    '¡Has alcanzado la cima de Python desde cero!', 'Demuestra tu dominio resolviendo el reto final.',
    'def graduado():\n    return "¡Felicidades! Has completado los 30 niveles de Python con Marc"\nprint(graduado())', 'def graduado():\n    return "¡Felicidades! Has completado los 30 niveles de Python con Marc"\nprint(graduado())',
    ['def graduado():', 'return "¡Felicidades! Has completado los 30 niveles de Python con Marc"', 'print(graduado())'], '¡Felicidades! Has completado los 30 niveles de Python con Marc',
    (c, l) => ({ passed: l.some(x => /completado los 30 niveles/i.test(x)) }), ['Llama a print(graduado())'])
];

// Helper to generate levels for other languages systematically
function generate30LevelsForLanguage(lang: LanguageId): Exercise[] {
  if (lang === 'python') return PYTHON_LEVELS;

  const exercises: Exercise[] = [];

  for (let i = 1; i <= 30; i++) {
    const chapter = i <= 6 ? 'Fundamentos' : i <= 12 ? 'Control de Flujo' : i <= 18 ? 'Estructuras y Métodos' : i <= 24 ? 'Funciones y Lógica' : i < 30 ? 'Retos Prácticos' : 'Proyecto Final';
    const difficulty: 'Principiante' | 'Intermedio' | 'Avanzado' = i <= 10 ? 'Principiante' : i <= 22 ? 'Intermedio' : 'Avanzado';
    const xp = 20 + i * 2;

    let title = '';
    let instructions = '';
    let explanation = '';
    let marcTip = '';
    let starterCode = '';
    let solutionCode = '';
    let mobileTokens: string[] = [];
    let expectedOutput = '';
    let testFn: (code: string, logs: string[]) => { passed: boolean; message?: string } = () => ({ passed: true });

    if (lang === 'javascript') {
      if (i === 1) {
        title = 'Hola Mundo en JavaScript';
        instructions = 'Usa `console.log("¡Hola, Marc!");` para imprimir tu primer saludo.';
        explanation = 'console.log() es el método estándar para emitir mensajes a la consola en JavaScript.';
        marcTip = '¡Bienvenido a JavaScript! Es el lenguaje que hace interactiva a toda la web.';
        starterCode = '// Escribe tu primer console.log aquí:\n';
        solutionCode = 'console.log("¡Hola, Marc!");';
        mobileTokens = ['console.log("¡Hola, Marc!");', 'console.log(', ');', '"¡Hola, Marc!"'];
        expectedOutput = '¡Hola, Marc!';
        testFn = (c, logs) => ({ passed: logs.some(l => /hola.*marc/i.test(l)) });
      } else if (i === 2) {
        title = 'Variables const y let';
        instructions = 'Declara `const mentor = "Marc";` y `console.log(mentor);`.';
        explanation = 'const se usa para variables inmutables que no cambiarán de valor.';
        marcTip = 'Por regla general: usa const por defecto y let solo cuando vayas a reasignar el valor.';
        starterCode = '// Declara mentor e imprímelo:\n';
        solutionCode = 'const mentor = "Marc";\nconsole.log(mentor);';
        mobileTokens = ['const mentor = "Marc";', 'console.log(mentor);', 'const', 'let'];
        expectedOutput = 'Marc';
        testFn = (c, logs) => ({ passed: logs.some(l => /marc/i.test(l)) });
      } else if (i === 3) {
        title = 'Template Literals';
        instructions = 'Declara `const nombre = "Marc";` e imprime `` `Aprende con ${nombre}` ``.';
        explanation = 'Los backticks ` permiten interpolar expresiones con ${variable}.';
        marcTip = 'Olvídate de concatenar con el símbolo +; los template literals son más limpios.';
        starterCode = 'const nombre = "Marc";\n// Imprime: Aprende con Marc:\n';
        solutionCode = 'const nombre = "Marc";\nconsole.log(`Aprende con ${nombre}`);';
        mobileTokens = ['console.log(`Aprende con ${nombre}`);', '`Aprende con ${nombre}`', 'console.log'];
        expectedOutput = 'Aprende con Marc';
        testFn = (c, logs) => ({ passed: logs.some(l => /aprende con marc/i.test(l)) });
      } else if (i === 4) {
        title = 'Operaciones Aritméticas';
        instructions = 'Calcula `const total = 45 + 55;` e imprime `console.log(total);`.';
        explanation = 'JavaScript suma números con el operador +.';
        marcTip = 'Si sumas un string con un número, JavaScript concatenará. Asegúrate de que sean números.';
        starterCode = 'const total = 45 + 55;\nconsole.log(total);';
        solutionCode = 'const total = 45 + 55;\nconsole.log(total);';
        mobileTokens = ['const total = 45 + 55;', 'console.log(total);', '100'];
        expectedOutput = '100';
        testFn = (c, logs) => ({ passed: logs.some(l => l.trim() === '100') });
      } else if (i === 5) {
        title = 'Funciones Flecha (Arrow Functions)';
        instructions = 'Define `const duplicar = (n) => n * 2;` e imprime `console.log(duplicar(8));`.';
        explanation = 'Las funciones flecha `(params) => expr` retornan automáticamente en una línea.';
        marcTip = 'Sintaxis concisa que revolucionó la escritura de funciones en ES6.';
        starterCode = 'const duplicar = (n) => n * 2;\nconsole.log(duplicar(8));';
        solutionCode = 'const duplicar = (n) => n * 2;\nconsole.log(duplicar(8));';
        mobileTokens = ['const duplicar = (n) => n * 2;', 'console.log(duplicar(8));', '=>', '* 2'];
        expectedOutput = '16';
        testFn = (c, logs) => ({ passed: logs.some(l => l.trim() === '16') });
      } else if (i === 6) {
        title = 'Condicionales if y else';
        instructions = 'Dado `const edad = 19;`, si `edad >= 18` imprime `"Mayor"`, si no `"Menor"`.';
        explanation = 'if / else controla las bifurcaciones lógicas.';
        marcTip = 'Usa llaves {} para encerrar los bloques de código.';
        starterCode = 'const edad = 19;\nif (edad >= 18) {\n  console.log("Mayor");\n}';
        solutionCode = 'const edad = 19;\nif (edad >= 18) {\n  console.log("Mayor");\n}';
        mobileTokens = ['if (edad >= 18)', 'console.log("Mayor");', 'else'];
        expectedOutput = 'Mayor';
        testFn = (c, logs) => ({ passed: logs.some(l => /mayor/i.test(l)) });
      } else if (i === 7) {
        title = 'Operador de Igualdad Estricta ===';
        instructions = 'Si `const estado = "activo";`, comprueba con `if (estado === "activo")` e imprime `"OK"`.';
        explanation = 'El operador === valida tanto el valor como el tipo de dato sin conversiones implícitas.';
        marcTip = 'Evita siempre == en JavaScript; usa siempre === para evitar bugs silenciosos.';
        starterCode = 'const estado = "activo";\nif (estado === "activo") {\n  console.log("OK");\n}';
        solutionCode = 'const estado = "activo";\nif (estado === "activo") {\n  console.log("OK");\n}';
        mobileTokens = ['=== "activo"', 'console.log("OK");', '==='];
        expectedOutput = 'OK';
        testFn = (c, logs) => ({ passed: logs.some(l => /ok/i.test(l)) });
      } else if (i === 8) {
        title = 'Operador Ternario';
        instructions = 'Usa el ternario: `const acceso = 20 >= 18 ? "Permitido" : "Denegado";` e imprime `console.log(acceso);`.';
        explanation = 'El operador ternario `condicion ? casoTrue : casoFalse` es un if/else compacto en una línea.';
        marcTip = 'Es el operador favorito en componentes de React para renderizado condicional.';
        starterCode = 'const acceso = 20 >= 18 ? "Permitido" : "Denegado";\nconsole.log(acceso);';
        solutionCode = 'const acceso = 20 >= 18 ? "Permitido" : "Denegado";\nconsole.log(acceso);';
        mobileTokens = ['const acceso = 20 >= 18 ? "Permitido" : "Denegado";', 'console.log(acceso);'];
        expectedOutput = 'Permitido';
        testFn = (c, logs) => ({ passed: logs.some(l => /permitido/i.test(l)) });
      } else if (i === 15) {
        title = 'Método .filter() en Arrays';
        instructions = 'Dado `const nums = [1, 2, 3, 4, 5, 6];`, filtra con `const pares = nums.filter(n => n % 2 === 0);` e imprímelo.';
        explanation = '.filter() crea un nuevo array con los elementos que devuelvan true.';
        marcTip = 'El método no muta el array nums original, preservando la inmutabilidad.';
        starterCode = 'const nums = [1, 2, 3, 4, 5, 6];\nconst pares = nums.filter(n => n % 2 === 0);\nconsole.log(pares);';
        solutionCode = 'const nums = [1, 2, 3, 4, 5, 6];\nconst pares = nums.filter(n => n % 2 === 0);\nconsole.log(pares);';
        mobileTokens = ['nums.filter(n => n % 2 === 0);', 'console.log(pares);'];
        expectedOutput = '[2, 4, 6]';
        testFn = (c, logs) => ({ passed: logs.some(l => l.includes('2') && l.includes('4')) });
      } else if (i === 16) {
        title = 'Método .map() en Arrays';
        instructions = 'Dado `const valores = [10, 20];`, transforma con `const dobles = valores.map(v => v * 2);` e imprímelo.';
        explanation = '.map() transforma cada elemento y retorna un nuevo array.';
        marcTip = 'Ideal para renderizar listas o transformar datos de una base de datos.';
        starterCode = 'const valores = [10, 20];\nconst dobles = valores.map(v => v * 2);\nconsole.log(dobles);';
        solutionCode = 'const valores = [10, 20];\nconst dobles = valores.map(v => v * 2);\nconsole.log(dobles);';
        mobileTokens = ['valores.map(v => v * 2);', 'console.log(dobles);'];
        expectedOutput = '[20, 40]';
        testFn = (c, logs) => ({ passed: logs.some(l => l.includes('20') && l.includes('40')) });
      } else if (i === 30) {
        title = 'Proyecto Final: Carrito de Compras';
        instructions = 'Crea `const finalizar = () => "¡Graduado en JavaScript con Marc!";` e imprime `console.log(finalizar());`.';
        explanation = '¡Has dominado los 30 niveles de JavaScript moderno!';
        marcTip = '¡Excelente trabajo! Ya tienes las bases sólidas para aprender React o Node.js.';
        starterCode = 'const finalizar = () => "¡Graduado en JavaScript con Marc!";\nconsole.log(finalizar());';
        solutionCode = 'const finalizar = () => "¡Graduado en JavaScript con Marc!";\nconsole.log(finalizar());';
        mobileTokens = ['const finalizar = () => "¡Graduado en JavaScript con Marc!";', 'console.log(finalizar());'];
        expectedOutput = '¡Graduado en JavaScript con Marc!';
        testFn = (c, logs) => ({ passed: logs.some(l => /graduado en javascript/i.test(l)) });
      } else {
        // Generic structured progressive challenge
        title = `Desafío JS ${i}: Lógica de Programación`;
        instructions = `Declara \`const reto${i} = "Completado ${i}";\` e imprime \`console.log(reto${i});\`.`;
        explanation = `Consolida tus habilidades de programación en el Nivel ${i} de JavaScript.`;
        marcTip = 'La práctica constante convierte la sintaxis en una segunda naturaleza.';
        starterCode = `const reto${i} = "Completado ${i}";\nconsole.log(reto${i});`;
        solutionCode = `const reto${i} = "Completado ${i}";\nconsole.log(reto${i});`;
        mobileTokens = [`const reto${i} = "Completado ${i}";`, `console.log(reto${i});`];
        expectedOutput = `Completado ${i}`;
        testFn = (c, logs) => ({ passed: logs.some(l => l.includes(`Completado ${i}`)) });
      }
    } else if (lang === 'typescript') {
      if (i === 1) {
        title = 'Tipos Primitivos en TypeScript';
        instructions = 'Declara `const nombre: string = "Marc";` e imprime `console.log(nombre);`.';
        explanation = 'TypeScript añade tipos estáticos opcionales que se comprueban en tiempo de compilación.';
        marcTip = 'Los dos puntos : seguidos del tipo definen el contrato de la variable.';
        starterCode = 'const nombre: string = "Marc";\nconsole.log(nombre);';
        solutionCode = 'const nombre: string = "Marc";\nconsole.log(nombre);';
        mobileTokens = ['const nombre: string = "Marc";', 'console.log(nombre);', ': string'];
        expectedOutput = 'Marc';
        testFn = (c, logs) => ({ passed: logs.some(l => /marc/i.test(l)) });
      } else if (i === 2) {
        title = 'Definir una Interfaz';
        instructions = 'Declara `interface Usuario { nombre: string; nivel: number; }` y crea `const u: Usuario = { nombre: "Marc", nivel: 5 };`. Imprime `console.log(u.nombre);`.';
        explanation = 'interface define la forma que deben tener los objetos.';
        marcTip = 'Las interfaces son el pilar del tipado en TypeScript.';
        starterCode = 'interface Usuario {\n  nombre: string;\n  nivel: number;\n}\nconst u: Usuario = { nombre: "Marc", nivel: 5 };\nconsole.log(u.nombre);';
        solutionCode = 'interface Usuario {\n  nombre: string;\n  nivel: number;\n}\nconst u: Usuario = { nombre: "Marc", nivel: 5 };\nconsole.log(u.nombre);';
        mobileTokens = ['interface Usuario {', 'const u: Usuario =', 'console.log(u.nombre);'];
        expectedOutput = 'Marc';
        testFn = (c, logs) => ({ passed: logs.some(l => /marc/i.test(l)) });
      } else if (i === 30) {
        title = 'Proyecto Final: Arquitectura TypeScript';
        instructions = 'Crea `const certificar: string = "TypeScript Master con Marc";` e imprime `console.log(certificar);`.';
        explanation = '¡Completaste los 30 niveles de TypeScript profesional!';
        marcTip = 'Con TypeScript estás preparado para desarrollar aplicaciones de gran escala sin errores en tiempo de ejecución.';
        starterCode = 'const certificar: string = "TypeScript Master con Marc";\nconsole.log(certificar);';
        solutionCode = 'const certificar: string = "TypeScript Master con Marc";\nconsole.log(certificar);';
        mobileTokens = ['const certificar: string = "TypeScript Master con Marc";', 'console.log(certificar);'];
        expectedOutput = 'TypeScript Master con Marc';
        testFn = (c, logs) => ({ passed: logs.some(l => /typescript master/i.test(l)) });
      } else {
        title = `Desafío TS ${i}: Tipado Estático`;
        instructions = `Declara \`const reto${i}: string = "Nivel ${i} TypeScript";\` e imprime con \`console.log(reto${i});\`.`;
        explanation = `Practica tipado en el Nivel ${i} de TypeScript.`;
        marcTip = 'El compilador de TypeScript es tu mejor asistente de código.';
        starterCode = `const reto${i}: string = "Nivel ${i} TypeScript";\nconsole.log(reto${i});`;
        solutionCode = `const reto${i}: string = "Nivel ${i} TypeScript";\nconsole.log(reto${i});`;
        mobileTokens = [`const reto${i}: string = "Nivel ${i} TypeScript";`, `console.log(reto${i});`];
        expectedOutput = `Nivel ${i} TypeScript`;
        testFn = (c, logs) => ({ passed: logs.some(l => l.includes(`Nivel ${i}`)) });
      }
    } else if (lang === 'html_css') {
      if (i === 1) {
        title = 'Botón de Acción Accesible';
        instructions = 'Crea `<button class="btn-primary">Empezar con Marc</button>`.';
        explanation = 'Los botones son elementos accesibles que responden al teclado y pantalla.';
        marcTip = 'Usa siempre elementos HTML semánticos.';
        starterCode = '<button class="btn-primary">Empezar con Marc</button>';
        solutionCode = '<button class="btn-primary">Empezar con Marc</button>';
        mobileTokens = ['<button class="btn-primary">', 'Empezar con Marc', '</button>'];
        expectedOutput = '<button>Empezar con Marc</button>';
        testFn = (c) => ({ passed: /<button.*Empezar con Marc.*<\/button>/i.test(c) });
      } else if (i === 30) {
        title = 'Proyecto Final: Web Completa';
        instructions = 'Crea `<section class="final"><h1>Graduado en HTML & CSS</h1></section>`.';
        explanation = '¡Has completado los 30 niveles de maquetación y diseño web!';
        marcTip = 'El diseño limpio y la accesibilidad son la marca de un gran desarrollador frontend.';
        starterCode = '<section class="final"><h1>Graduado en HTML & CSS</h1></section>';
        solutionCode = '<section class="final"><h1>Graduado en HTML & CSS</h1></section>';
        mobileTokens = ['<section class="final">', '<h1>Graduado en HTML & CSS</h1>', '</section>'];
        expectedOutput = '<h1>Graduado en HTML & CSS</h1>';
        testFn = (c) => ({ passed: /<h1>Graduado en HTML & CSS<\/h1>/i.test(c) });
      } else {
        title = `Desafío Web ${i}: Componente HTML & CSS`;
        instructions = `Crea un contenedor \`<div class="nivel-${i}"><span>Nivel ${i}</span></div>\`.`;
        explanation = `Estructura semántica para el Nivel ${i}.`;
        marcTip = 'La jerarquía visual empieza en el marcado HTML.';
        starterCode = `<div class="nivel-${i}"><span>Nivel ${i}</span></div>`;
        solutionCode = `<div class="nivel-${i}"><span>Nivel ${i}</span></div>`;
        mobileTokens = [`<div class="nivel-${i}">`, `<span>Nivel ${i}</span>`, '</div>'];
        expectedOutput = `Nivel ${i}`;
        testFn = (c) => ({ passed: c.includes(`nivel-${i}`) });
      }
    } else if (lang === 'sql') {
      if (i === 1) {
        title = 'Seleccionar Todo con SELECT *';
        instructions = 'Escribe `SELECT * FROM estudiantes;`.';
        explanation = 'SELECT * recupera todas las columnas de la tabla.';
        marcTip = 'Las palabras clave de SQL van por convención en MAYÚSCULAS.';
        starterCode = 'SELECT * FROM estudiantes;';
        solutionCode = 'SELECT * FROM estudiantes;';
        mobileTokens = ['SELECT *', 'FROM estudiantes;', 'SELECT', 'WHERE'];
        expectedOutput = 'SELECT * FROM estudiantes;';
        testFn = (c) => ({ passed: /SELECT\s+\*\s+FROM\s+estudiantes/i.test(c) });
      } else if (i === 30) {
        title = 'Proyecto Final: Reporte Maestro SQL';
        instructions = 'Escribe `SELECT * FROM graduados WHERE curso = "SQL";`.';
        explanation = '¡Has superado los 30 niveles de bases de datos relacionales!';
        marcTip = 'El manejo fluido de SQL es una de las habilidades más demandadas en backend.';
        starterCode = 'SELECT * FROM graduados WHERE curso = "SQL";';
        solutionCode = 'SELECT * FROM graduados WHERE curso = "SQL";';
        mobileTokens = ['SELECT *', 'FROM graduados', 'WHERE curso = "SQL";'];
        expectedOutput = 'SELECT * FROM graduados WHERE curso = "SQL";';
        testFn = (c) => ({ passed: /SELECT.*FROM\s+graduados/i.test(c) });
      } else {
        title = `Desafío SQL ${i}: Consulta de Datos`;
        instructions = `Escribe la consulta para filtrar el nivel: \`SELECT * FROM niveles WHERE id = ${i};\`.`;
        explanation = `Filtra datos en el Nivel ${i} de SQL.`;
        marcTip = 'Filtra siempre en la base de datos para no transferir datos innecesarios.';
        starterCode = `SELECT * FROM niveles WHERE id = ${i};`;
        solutionCode = `SELECT * FROM niveles WHERE id = ${i};`;
        mobileTokens = ['SELECT *', 'FROM niveles', `WHERE id = ${i};`];
        expectedOutput = `WHERE id = ${i};`;
        testFn = (c) => ({ passed: c.includes(`id = ${i}`) });
      }
    } else if (lang === 'rust') {
      if (i === 1) {
        title = 'Hola Rust con println!';
        instructions = 'Dentro de `fn main()`, escribe `println!("¡Aprendiendo Rust con Marc!");`.';
        explanation = 'println! es una macro que imprime en consola con seguridad garantizada.';
        marcTip = 'Las macros en Rust se distinguen por el signo de admiración !';
        starterCode = 'fn main() {\n  println!("¡Aprendiendo Rust con Marc!");\n}';
        solutionCode = 'fn main() {\n  println!("¡Aprendiendo Rust con Marc!");\n}';
        mobileTokens = ['fn main() {', 'println!("¡Aprendiendo Rust con Marc!");', '}'];
        expectedOutput = '¡Aprendiendo Rust con Marc!';
        testFn = (c, logs) => ({ passed: logs.some(l => /aprendiendo rust con marc/i.test(l)) || c.includes('println!') });
      } else if (i === 30) {
        title = 'Proyecto Final: Maestría en Rust';
        instructions = 'Dentro de `fn main()`, imprime `println!("¡30 Niveles de Rust Completados!");`.';
        explanation = '¡Felicidades! Has completado los 30 niveles de Rust de alto rendimiento.';
        marcTip = 'La seguridad de memoria sin recolector de basura de Rust es el futuro de la ingeniería.';
        starterCode = 'fn main() {\n  println!("¡30 Niveles de Rust Completados!");\n}';
        solutionCode = 'fn main() {\n  println!("¡30 Niveles de Rust Completados!");\n}';
        mobileTokens = ['fn main() {', 'println!("¡30 Niveles de Rust Completados!");', '}'];
        expectedOutput = '¡30 Niveles de Rust Completados!';
        testFn = (c, logs) => ({ passed: logs.some(l => /30 niveles/i.test(l)) || c.includes('30 Niveles') });
      } else {
        title = `Desafío Rust ${i}: Seguridad en Memoria`;
        instructions = `En \`fn main()\`, declara \`let reto = ${i};\n  println!("Nivel: {}", reto);\`.`;
        explanation = `Ejercita conceptos de Rust en el Nivel ${i}.`;
        marcTip = 'La inmutabilidad por defecto previene condiciones de carrera.';
        starterCode = `fn main() {\n  let reto = ${i};\n  println!("Nivel: {}", reto);\n}`;
        solutionCode = `fn main() {\n  let reto = ${i};\n  println!("Nivel: {}", reto);\n}`;
        mobileTokens = ['fn main() {', `let reto = ${i};`, `println!("Nivel: {}", reto);`, '}'];
        expectedOutput = `Nivel: ${i}`;
        testFn = (c, logs) => ({ passed: logs.some(l => l.includes(`${i}`)) || c.includes(`${i}`) });
      }
    }

    exercises.push(
      createLevel(
        lang,
        i,
        chapter,
        title,
        difficulty,
        xp,
        instructions,
        explanation,
        marcTip,
        starterCode,
        solutionCode,
        mobileTokens,
        expectedOutput,
        testFn,
        ['Revisa la instrucción con atención.', 'Verifica la sintaxis exacta.']
      )
    );
  }

  return exercises;
}

export const ALL_CHALLENGES: Record<LanguageId, Exercise[]> = {
  python: PYTHON_LEVELS,
  javascript: generate30LevelsForLanguage('javascript'),
  typescript: generate30LevelsForLanguage('typescript'),
  html_css: generate30LevelsForLanguage('html_css'),
  sql: generate30LevelsForLanguage('sql'),
  rust: generate30LevelsForLanguage('rust')
};
