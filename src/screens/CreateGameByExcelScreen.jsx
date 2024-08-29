import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import { useGameDB } from '../utils/GameDBContext';

const CreateGameByExcelScreen = ({ navigation }) => {
  const [excelData, setExcelData] = useState(hardcodedXmlData);
  const { createGameByExcel } = useGameDB();   

  const handleSave = async () => {
    try {
      await createGameByExcel(excelData);
      Alert.alert('Success', 'Games created successfully!');
    } catch (error) {
      console.error('CreateGameByExcel/handleSave/Error: ', error);
      Alert.alert('Error', 'Failed to create games.');
    }
  };  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Paste Excel Data:</Text>
      <TextInput
        style={styles.textBox}
        multiline
        numberOfLines={20}
        value={excelData}
        onChangeText={setExcelData}
        placeholder="Paste your data here"        
      />
      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  textBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    height: 200,
    marginBottom: 20,
  },
});

const hardcodedXmlData = `
NEXT				
Angular	The 'Software Engineer Interview - Angular' game sharpens your knowledge of Angular concepts vital for technical interviews. Enhance your skills with key topics and scenarios tailored for software engineering discussions!	Interview	interview_angular	
Question	Correct Answer	Invalid Answer 1	Invalid Answer 2	Invalid Answer 3
What is the role of AuthGuard in Angular applications?	Controls access to routes	Handles error messages	Manages data binding	Configures routing paths
What are Angular lifecycle hooks and their purpose?	ngOnChanges, ngOnInit, etc.	ngModule, ngRoute, etc.	ngBind, ngClick, etc.	ngForm, ngModel, etc.
What is NgRx used for in Angular applications?	State management library	UI styling library	HTTP request handling	Form validation tool
How does two-way data binding work in Angular.js?	Synchronizes model and view	Renders HTML elements	Manages API requests	Handles user authentication
What is the ngRoute module used for in Angular.js?	Client-side routing	Error handling	State management	Data binding
How do services interact with a .NET Core backend in Angular?	Making HTTP requests	Handling form validation	Rendering UI components	Managing state
What is the purpose of the $http service in Angular.js?	Making HTTP requests	Managing state	Handling events	Styling components
How is error handling for API calls implemented in Angular.js?	Using observables and error callbacks	By configuring CORS policies	Through ngRepeat directive	Using ngModel for binding
What are directives in Angular.js?	Markers on DOM elements	Methods for API calls	Lifecycle hooks	Form handling
How does the ng-model directive work in Angular.js?	Binds an element to a property	Handles HTTP requests	Manages authentication	Configures routing
What does the ng-click directive do in Angular.js?	Binds a click event to a function	Manages state	Handles form submission	Configures lifecycle hooks
How do ng-show and ng-hide work in Angular.js?	Conditionally display elements	Manage routing paths	Handle HTTP errors	Manage state binding
What is the purpose of the ng-repeat directive in Angular.js?	Iterates over a collection	Handles authentication	Manages state	Configures routing
What is the digest cycle in Angular.js?	Checks for data changes and updates DOM	Manages HTTP requests	Handles form validation	Configures lifecycle hooks
How can performance be optimized in Angular applications?	Using lazy loading, AOT compilation	By managing state	Through error handling	Using two-way binding
How does Angular.js handle forms?	Using ngForm and ngModel	Through ngRoute	With ngBind and ngClick	Using lifecycle hooks
How are authentication and authorization managed in Angular applications?	Using token-based approaches (JWT)	With ngForm and ngModel	Through ngRoute	Using ngBind and ngClick
What is the role of controllers in Angular applications?	Handling application logic	Managing state	Handling HTTP requests	Configuring routes
How are CORS issues handled on the .NET Core backend?	By configuring CORS policies	Using state management	Through ngForm and ngModel	Using ngRoute module
What is the purpose of the $rootScope in Angular.js?	Global event communication	Managing state	Handling HTTP requests	Configuring routes
How can data be shared between controllers in Angular.js?	Using services	Managing state	Handling events	Using lifecycle hooks
How is unit testing performed in Angular.js?	Using Jasmine or Mocha	Managing state	Handling HTTP requests	Configuring routes
What is transclusion in Angular.js?	Creating reusable layouts	Managing state	Handling events	Using lifecycle hooks
What is the ngLocale module used for in Angular.js?	Internationalization (i18n)	Managing state	Handling HTTP requests	Configuring routes
How should an Angular.js application be organized and structured when working with a .NET Core backend?	Organizing code by feature and using modules	Managing state	Handling HTTP requests	Configuring routes
NEXT				
React	The 'Software Engineer Interview - React' game hones your expertise in React-specific concepts crucial for technical interviews. Master essential topics and scenarios to ace your software engineering discussions!	Interview	interview_react	
Question	Correct Answer	Invalid Answer 1	Invalid Answer 2	Invalid Answer 3
What is the purpose of the Virtual DOM in React?	To minimize updates needed in the real DOM	To update the actual DOM directly	To handle HTTP requests	To manage state
What is JSX and how is it used in React?	A syntax extension for JavaScript	A CSS preprocessor	A JavaScript testing framework	A routing tool in React
How does React's unidirectional data flow work?	Data flows from parent to child components	Data flows in both directions	Data flows from child to parent	Data flows to the state manager
What is the role of state in a React component?	Internal data that triggers re-renders	External data passed to a component	Defines component styles	A lifecycle hook
What are props in React and how are they used?	External, immutable data passed from parent	Internal state data	Handles events	Defines component methods
What are the stages of the React component lifecycle?	Mounting, Updating, Unmounting, Error Handling	Initialization, Execution, Termination	Binding, Rendering, Updating	Loading, Processing, Displaying
How does Flux architecture complement React?	Manages data flow with actions, dispatchers, stores, and views	Used for styling components	Handles form validation	A server-side rendering tool
What is Redux and how does it work with React?	A centralized state container with unidirectional flow	A CSS framework	A testing library	Handles HTTP requests
What is Webpack and how is it used in web development?	A module bundler transforming assets for the web	A state management tool	A database management system	Used for testing
What is Babel and what does it do in a React application?	A JavaScript compiler for browser compatibility	A module bundler	A CSS preprocessor	Handles API requests
What are responsive design principles in web development?	Fluid Grid Layout, Flexible Media, Media Queries	Server-side rendering, Code splitting	Form validation, Event handling	Component styling, Data fetching
What is TypeScript and how does it benefit React development?	Adds static types for better error catching	A CSS framework	A testing library	Handles API requests
What techniques can optimize the performance of a React application?	Code splitting, memoization, efficient state management	Using only client-side rendering	Avoiding all third-party libraries	Using inline CSS for all components
What is the useEffect hook in React and how is it used?	For side effects like fetching data or changing the DOM	Handles component styling	Manages form validation	Used for state management
How can the performance of a React application integrated with a .NET Core backend be optimized?	Code splitting, lazy loading, using PureComponent/React.memo	Avoiding server-side rendering	Using only client-side routing	Avoiding the use of hooks
How does Babel ensure compatibility across different browsers?	Transpiles JSX and ES6+ code into browser-compatible code	Manages state	Handles form submissions	Used for component styling
What is CORS and why is it important in web development?	Allows resource sharing from another domain	Used for state management	Handles form validation	A testing library
How does React Router handle client-side navigation in a single-page application?	Uses the history API for navigation without full page reloads	Handles state management	Manages form submissions	Used for server-side rendering
What is the useMemo hook in React and when should it be used?	Memoizes computation results to prevent recalculations	Manages component styling	Handles event listeners	Used for form validation
What is the significance of keys in React lists?	Identify elements uniquely for efficient updates	Used for state management	Handles HTTP requests	Manages component styles
What is props drilling in React and how can it be mitigated?	Passing props through multiple layers, mitigated by Context or Redux	Handles form validation	A testing strategy	Optimizes API calls
How does server-side rendering (SSR) differ from client-side rendering (CSR) in React applications?	SSR renders on the server; CSR renders on the client	SSR handles state management	SSR is used for testing	SSR is a database management system
What is the useRef hook in React and how is it used?	Creates references to DOM elements for direct manipulation	Manages state	Handles HTTP requests	Used for component styling
What are higher-order components (HOCs) in React?	Functions that enhance components for code reuse	Handles state management	Manages form validation	Used for styling
What is the useContext hook in React and when should it be used?	Accesses context values to avoid props drilling	Handles component styling	Manages state	Used for form validation
What are custom hooks in React and why are they useful?	Reusable logic for functional components	Manages state	Handles HTTP requests	Used for styling
What is the ref attribute in React and how is it used?	Creates references to DOM elements or components	Handles state management	Manages form submissions	Used for event handling
What is a reducer function in React and how is it used?	Specifies how state changes in response to actions	Handles component styling	Manages HTTP requests	Used for form validation
What is the useSelector hook in React Redux and how is it used?	Selects state from the Redux store for components	Manages component styles	Handles form validation	Used for routing
What is the useDispatch hook in React Redux and how is it used?	Dispatches actions to the Redux store to update state	Handles component styling	Manages state	Used for form validation
What is Express Validator and how is it used?	Middleware for validating and sanitizing user input in Express.js	Handles state management	Manages HTTP requests	Used for routing
NEXT				
.Net Full stack	The '.Net Full stack SG/2024 - Part 1' game prepares you for job interviews in Singapore with questions on front-end, back-end development, databases, and best practices. Perfect for boosting your technical skills and interview confidence!	Interview	interview_dotnetfullstack	
Question	Correct Answer	Invalid Answer 1	Invalid Answer 2	Invalid Answer 3
What is SOLID?	Set of design principles.	SOLID is a new programming language.	SOLID is used to design user interfaces.	SOLID is a database management tool.
What are Abstract classes?	Classes with both abstract and concrete methods.	Used for defining common interfaces only.	Can inherit multiple concrete classes.	Handle different objects without common behavior.
What is Dependency Injection?	Providing dependencies externally.	Bundles data into microservices.	Manages object creation and composition internally.	Encapsulates data and methods into a class.
What is Polymorphism?	Performing actions on objects through a common interface.	Specifies data types as 'object' instead of specific types.	Using the same method name for different tasks.	Manages object interactions based on their type.
What are Angular lifecycle hooks and their purpose?	ngOnChanges, ngOnInit, etc.	ngModule, ngRoute, etc.	ngBind, ngClick, etc.	ngForm, ngModel, etc.
What is NgRx used for in Angular applications?	State management library	UI styling library	HTTP request handling	Form validation tool
How does two-way data binding work in Angular.js?	Synchronizes model and view	Renders HTML elements	Manages API requests	Handles user authentication
How does the ng-model directive work in Angular.js?	Binds an element to a property	Handles HTTP requests	Manages authentication	Configures routing
What is the useEffect hook in React and how is it used?	For side effects like fetching data or changing the DOM	Handles component styling	Manages form validation	Used for state management
What is the ref attribute in React and how is it used?	Creates references to DOM elements or components	Handles state management	Manages form submissions	Used for event handling
What is a reducer function in React and how is it used?	Specifies how state changes in response to actions	Handles component styling	Manages HTTP requests	Used for form validation
What is the useDispatch hook in React Redux and how is it used?	Dispatches actions to the Redux store to update state	Handles component styling	Manages state	Used for form validation
How do async and await work in JavaScript?	Async: declares async function, Await: pauses execution	Async pauses code execution, and await defines asynchronous functions	Both are used for defining functions	They are used for error handling
What is the purpose of the "this" keyword in JavaScript?	Refers to the object it belongs to	Refers to the function itself	Points to the previous object	Used to create new variables
Explain the difference between let, const, and var in JavaScript?	Let/const: block scope, Var: function scope	Let and const are function-scoped, var is block-scoped	All three are block-scoped	Let and var are constants, const is variable
What does the map function do in JavaScript?	Transforms array elements	Maps objects to arrays	Sorts elements in an array	Removes elements from an array
What is middleware in .NET Core and its role in handling HTTP requests?	Software that handles HTTP requests and responses in a pipeline	A tool for managing databases	A language for building APIs	A library for user authentication
Can you explain the concept of middleware in web development, especially in Express.js?	Software providing common services and features to applications	A database management system	A tool for creating web pages	A framework for building mobile apps
What is a Singleton Instance and how is it used in design patterns?	A design pattern ensuring one instance of a class	A function that runs once	A method for creating multiple instances	A tool for database access
What are some common middleware technologies used in modern web development?	React with Node.js, GraphQL, and .NET Core	Python with Flask	Ruby on Rails	Java with Spring Boot
What are the advantages of using middleware in application architecture?	Centralized authentication, scalability, and reusability	Only for handling errors	For creating user interfaces	Only for database connections
What is MVC, and how does it implement the Model-View-Controller architectural pattern?	A framework separating application into Model, View, and Controller	A design for database management	A protocol for network communication	A style of user interface design
What are ViewState and TempData?	ViewState persists state across postbacks; TempData passes data to the next request	Both store user sessions	Both manage application settings	Both are used for data caching
How is a Partial Page used within a web page in MVC?	A reusable portion of a web page	A method for data encryption	A protocol for network security	A tool for file uploads
What is ViewBag, and how is it used to pass data in MVC?	A dynamic container for passing data to views	A method for handling errors	A tool for managing databases	A function for rendering images
What is attribute routing, and how is it used in web development?	It allows defining routes directly in code using attributes	It is a way to manage database connections	It helps in styling web pages	It is a protocol for data encryption
How do WCF and Web API frameworks differ in their use cases?	WCF is for building distributed systems; Web API is for HTTP services	Both are for handling user inputs	Both manage web page layouts	Both are used for database migrations
What is JSON, and why is it commonly used in web development?	JSON is a lightweight data interchange format	It is a language for styling web pages	It is a protocol for file transfers	It is a library for creating animations
What are the basic principles of designing a RESTful web service?	Stateless communication over standard protocols	State management with sessions	Complex data processing algorithms	Real-time user authentication
What are the key components of a RESTful API, and what roles do they play?	Resource naming, URI structure, HTTP methods	Only for database queries	Only for user interface design	Only for session management
What are the essential elements of Web API in building RESTful services?	Controllers, routing, model binding	User authentication methods	Data encryption protocols	Error handling mechanisms
What is the role of ASP.NET Web API in developing HTTP services?	It focuses on RESTful principles for a variety of clients	It manages user sessions	It handles real-time data processing	It encrypts user data
Can you describe the key features and advantages of .NET Core over previous versions?	Open-source, cross-platform, modular design, improved performance, ORM.	Closed-source platform with limited compatibility.	Only for desktop applications with no cloud support.	Fewer features than its predecessors.
How does .NET Core ensure cross-platform compatibility?	Designed to run on Windows, macOS, and Linux.	Exclusive to Windows environments.	Only supports macOS.	Not designed for Linux platforms.
What does modularity mean in the context of .NET Core?	Allows developers to include only necessary components in their applications.	Requires all components to be included by default.	Does not support modular development.	Always monolithic.
What makes .NET Core an open-source platform?	Community contributions and NuGet package management	.NET Core has no open-source components.	Only parts of .NET Core are open source.	Discourages community involvement.
What do public, static, and void mean in C#?	"public" makes methods accessible; "static" belongs to the class; "void" returns no value.	"public" makes methods private; "static" makes them instance-specific; "void" returns a value.	Used for UI elements; database connections; file operations.	Used interchangeably.
What is the difference between System.String and System.Text.StringBuilder?	String is immutable; StringBuilder is mutable and efficient for dynamic string manipulations.	Both are the same.	Mutable; immutable.	Handles UI rendering; file operations.
What is the difference between "throw" and "throw ex" in C#?	"throw" preserves call stack; "throw ex" resets it, affecting debugging.	Both are the same.	Handles file operations; memory management.	UI elements; network communication.
What are the responsibilities of the CLR in C#?	Manages memory, executes code, enforces security, ensures type safety, and supports debugging.	Only memory management.	Handles UI rendering.	Handles file operations.
What is a view in SQL, and what are its benefits?	A saved query acting as a virtual table, enhancing data simplicity and security.	A view is a stored procedure for calculations.	A view is a temporary table for session data.	A view is an index for speeding up queries.
How does a JOIN operation work in SQL?	Combines data from two or more tables based on related columns.	A JOIN merges columns from tables.	A JOIN splits a table into parts.	A JOIN deletes rows from tables.
What is a trigger in SQL, and how is it used?	Instructions automatically executing on table or view events.	A trigger is used to manually update data.	A trigger is a type of index.	A trigger deletes rows from a table automatically.
How can you find duplicate records in a table?	Uses GROUP BY and HAVING clauses to filter groups with counts greater than one.	Using the DELETE statement.	Using the JOIN clause.	Using the INDEX clause.
What is a cursor in SQL, and when is it used?	Traverses result set rows, typically in stored procedures for row iteration.	A cursor updates rows in a table.	A cursor deletes rows from a table.	A cursor sorts data in a table.
NEXT				
Javascript	he 'Software Engineer Interview - JavaScript' game sharpens your understanding of key JavaScript concepts essential for technical interviews. Explore crucial topics and scenarios to excel in software engineering discussions!	Interview	interview_javascript	
Question	Correct Answer	Invalid Answer 1	Invalid Answer 2	Invalid Answer 3
Can you explain the difference between null and undefined in JavaScript?	Null: no value, Undefined: unassigned variable	Both mean the same in JavaScript	Null is a function, and undefined is a variable	Undefined is a number, and null is a string
How do you check the data type of a variable in JavaScript?	typeof operator	Use the checkType function	Use the getType method	Use the dataType function
What is the DOM and what is its role in web development?	Document Object Model, tree structure of web docs	A storage system for web data	A tool for making server requests	A library for handling CSS
What is event delegation and why is it useful?	Single event listener for multiple child elements	Directly attaching event listeners to each element	Removing event listeners dynamically	Using CSS for event handling
Can you explain what a closure is in JavaScript?	Function with access to its outer scope	A way to define a function within another function	A method for creating objects	A technique for handling events
How do async and await work in JavaScript?	Async: declares async function, Await: pauses execution	Async pauses code execution, and await defines asynchronous functions	Both are used for defining functions	They are used for error handling
What is the purpose of the "this" keyword in JavaScript?	Refers to the object it belongs to	Refers to the function itself	Points to the previous object	Used to create new variables
Explain the difference between let, const, and var in JavaScript?	Let/const: block scope, Var: function scope	Let and const are function-scoped, var is block-scoped	All three are block-scoped	Let and var are constants, const is variable
What does the map function do in JavaScript?	Transforms array elements	Maps objects to arrays	Sorts elements in an array	Removes elements from an array
What is the difference between == and === in JavaScript?	==: type coercion, ===: checks value and type	Both check value and type	== checks only type, === checks only value	== is for objects, === is for arrays
Can you explain hoisting in JavaScript?	Declarations moved to the top	Raising events to the top of the stack	Creating global variables automatically	Optimizing function execution
What is the localStorage object used for in web browsers?	Storing key/value pairs with no expiration	Storing temporary session data	Storing cookies	Handling user authentication
How does prototypal inheritance work in JavaScript?	Objects inherit from other objects	Classes inherit from other classes	Functions inherit from other functions	Variables inherit values from other variables
What is the Event Loop and why is it important in JavaScript?	Checks message queue for new events	Loops through arrays and objects	Manages event listeners	Handles HTTP requests
Explain the difference between a closure and a callback function in JavaScript?	Closure: access to outer scope, Callback: passed as argument	Both are used for asynchronous code	Closures are synchronous, callbacks are asynchronous	Closures are used for error handling, callbacks for data fetching
What is the purpose of the Promise object in JavaScript?	Represents async operation completion/failure	Handles synchronous operations	Used for defining functions	Manages event listeners
What is the fetch API and what is it used for?	Making network requests	Fetching elements from the DOM	Storing data in localStorage	Handling user inputs
Explain the concept of debouncing in JavaScript?	Limits how often a function can be executed	Caches function results	Delays function execution	Executes functions repeatedly
How would you handle Cross-Origin Resource Sharing (CORS) in JavaScript?	Set headers on the server-side	Using cookies for cross-origin requests	Storing data in localStorage	Using CSS for cross-origin requests
What are arrow functions and how are they used in JavaScript?	Shorter syntax for functions	Functions that point to other functions	Functions used only in loops	Functions used only in objects
What are let and const used for in JavaScript?	Block-scoped variables	Defining functions	Looping through arrays	Handling events
What are template literals in JavaScript?	String interpolation using backticks	Storing templates in variables	Creating HTML templates	Handling CSS
What is destructuring assignment in JavaScript?	Extracting values from arrays/objects	Combining multiple arrays	Sorting array elements	Handling function arguments
What are the spread and rest operators in JavaScript?	Spread: expand elements, Rest: collect elements	Defining object properties	Handling string operations	Looping through objects
What are classes in JavaScript and how are they used?	For object-oriented programming	For defining variables	For handling events	For managing functions
What are promises and why are they useful in JavaScript?	Handling async operations	Handling synchronous operations	Defining functions	Managing events
How do async and await simplify asynchronous code in JavaScript?	Make async code look synchronous	Creating loops	Handling synchronous operations	Managing events
What are modules and how are they used in JavaScript?	Modularize code	Defining functions	Creating arrays	Handling events
What are default parameters in JavaScript and how are they used?	Default values for function parameters	Setting default object properties	Handling array elements	Creating default functions
NEXT				
Middleware	Prepare for your software engineering interview with the 'Software Engineer Interview - Middleware' game. Master essential design patterns crucial for technical interviews, covering applications and real-world examples. Enhance your understanding and readiness effectively!	Interview	interview_middleware	
Question	Correct Answer	Invalid Answer 1	Invalid Answer 2	Invalid Answer 3
What is middleware in .NET Core and its role in handling HTTP requests?	Software that handles HTTP requests and responses in a pipeline	A tool for managing databases	A language for building APIs	A library for user authentication
Can you explain the concept of middleware in web development, especially in Express.js?	Software providing common services and features to applications	A database management system	A tool for creating web pages	A framework for building mobile apps
What is a Singleton Instance and how is it used in design patterns?	A design pattern ensuring one instance of a class	A function that runs once	A method for creating multiple instances	A tool for database access
What are some common middleware technologies used in modern web development?	React with Node.js, GraphQL, and .NET Core	Python with Flask	Ruby on Rails	Java with Spring Boot
What are the advantages of using middleware in application architecture?	Centralized authentication, scalability, and reusability	Only for handling errors	For creating user interfaces	Only for database connections
NEXT				
MVC	Prepare for your software engineering interview with the 'Software Engineer Interview - MVC' game. Master essential design patterns crucial for interviews, covering applications and real-world examples. Enhance your understanding effectively!	Interview	interview_mvc	
Question	Correct Answer	Invalid Answer 1	Invalid Answer 2	Invalid Answer 3
What is MVC, and how does it implement the Model-View-Controller architectural pattern?	A framework separating application into Model, View, and Controller	A design for database management	A protocol for network communication	A style of user interface design
What are ViewState and TempData?	ViewState persists state across postbacks; TempData passes data to the next request	Both store user sessions	Both manage application settings	Both are used for data caching
What is Entity Framework (EF) in .NET, and how does it benefit developers?	An ORM framework enabling .NET object use for databases	A tool for creating web pages	A library for user authentication	A method for session management
What are the key differences between IEnumerable and IQueryable in C#?	IEnumerable iterates in-memory; IQueryable queries remote data	Both handle user inputs	Both are used for UI design	Both manage configuration settings
How does Dependency Injection improve application development in .NET?	It promotes loose coupling and easier testing	It handles UI rendering	It is used for database connections	It manages file I/O operations
What is the difference between MVC and MVVM design patterns in software architecture?	MVC separates into Model, View, Controller; MVVM adds ViewModel	Both are used for database design	Both handle HTTP requests	Both are protocols for network layers
What role does a Layout Page play in the structure of a web page in MVC?	Acts as a template for common HTML structure	A method for user authentication	A tool for database access	A function for error handling
How is a Partial Page used within a web page in MVC?	A reusable portion of a web page	A method for data encryption	A protocol for network security	A tool for file uploads
What is ViewBag, and how is it used to pass data in MVC?	A dynamic container for passing data to views	A method for handling errors	A tool for managing databases	A function for rendering images
What is ViewData, and how does it differ from ViewBag in MVC?	A dictionary for passing data, requiring typecasting	A library for creating charts	A method for user validation	A tool for managing files
What are the advantages of using a static variable in .NET applications?	Shared state, memory efficiency, global access	Only for user inputs	Only for database queries	Only for session management
What are the disadvantages of using a static variable in .NET applications?	Thread safety issues, global state management, testing challenges	Only for rendering UI	Only for managing requests	Only for file operations
In the MVC page lifecycle, what happens before the controller processes a request?	Program.cs and Startup.cs configure the application	Database connections are established	User authentication is performed	Data validation occurs
How do you write C# code within HTML markup using Razor syntax?	Use the @ symbol to switch to C#	Enclose code in <script> tags	Embed code in CSS	Use the # symbol to switch to C#
What parameters are required when making an AJAX call in JavaScript?	URL, method, and data	User authentication	Database connection strings	Session identifiers
What is the purpose of bundling in web development, especially in MVC?	It is used to combine multiple files into one	Only for session management	Only for error logging	Only for user validation
How do you place a public/reusable view in MVC project?	Move the view to the Shared folder for reuse	Move the view to the bin folder	Move the view to the src folder	Update .gitignore file with view name
NEXT				
API	The 'Software Engineer Interview - API' game hones your skills in API concepts crucial for technical interviews. Dive into essential topics and scenarios to excel in software engineering discussions!	Interview	interview_api	
Question	Correct Answer	Invalid Answer 1	Invalid Answer 2	Invalid Answer 3
What is attribute routing, and how is it used in web development?	It allows defining routes directly in code using attributes	It is a way to manage database connections	It helps in styling web pages	It is a protocol for data encryption
How do WCF and Web API frameworks differ in their use cases?	WCF is for building distributed systems; Web API is for HTTP services	Both are for handling user inputs	Both manage web page layouts	Both are used for database migrations
What is JSON, and why is it commonly used in web development?	JSON is a lightweight data interchange format	It is a language for styling web pages	It is a protocol for file transfers	It is a library for creating animations
What are the basic principles of designing a RESTful web service?	Stateless communication over standard protocols	State management with sessions	Complex data processing algorithms	Real-time user authentication
What are the key components of a RESTful API, and what roles do they play?	Resource naming, URI structure, HTTP methods	Only for database queries	Only for user interface design	Only for session management
What are the essential elements of Web API in building RESTful services?	Controllers, routing, model binding	User authentication methods	Data encryption protocols	Error handling mechanisms
What is the role of ASP.NET Web API in developing HTTP services?	It focuses on RESTful principles for a variety of clients	It manages user sessions	It handles real-time data processing	It encrypts user data
NEXT				
.Net core	The 'Software Engineer Interview - .NET Core' game focuses on mastering .NET Core concepts essential for technical interviews. Explore key topics and scenarios to sharpen your skills and excel in software engineering interviews!	Interview	interview_dotnetcore	
Question	Correct Answer	Invalid Answer 1	Invalid Answer 2	Invalid Answer 3
What is the services in .NET Core?	Handle business logic, data access, or other functionalities in the backend	Manage frontend layouts and styles.	Used for client-side scripting.	Handle only user interface interactions.
What does it mean when a service is registered as Transient in .NET Core?	A new instance of the service is created for each request.	The service instance is shared across all requests.	The service is loaded once during the application start.	The service is used only for database connections.
How is a Scoped service defined and used in .NET Core?	A single instance is created per request.	A new instance is created for each user.	The instance is shared across the entire application.	Only used during application initialization.
What does Singleton service registration mean in .NET Core?	A single instance is created and shared for the entire application.	Multiple instances are created for each module.	Instances are created on a per-thread basis.	The service is reloaded for every user session.
Can you describe the key features and advantages of .NET Core over previous versions?	Open-source, cross-platform, modular design, improved performance, ORM.	Closed-source platform with limited compatibility.	Only for desktop applications with no cloud support.	Fewer features than its predecessors.
How does .NET Core ensure cross-platform compatibility?	Designed to run on Windows, macOS, and Linux.	Exclusive to Windows environments.	Only supports macOS.	Not designed for Linux platforms.
What does modularity mean in the context of .NET Core?	Allows developers to include only necessary components in their applications.	Requires all components to be included by default.	Does not support modular development.	Always monolithic.
What makes .NET Core an open-source platform?	Community contributions and NuGet package management	.NET Core has no open-source components.	Only parts of .NET Core are open source.	Discourages community involvement.
How does .NET Core handle side-by-side versioning?	Allows multiple versions to coexist on the same machine without interference.	.NET Core versions cannot coexist and interfere with each other.	Installing a new .NET Core version removes the old one.	.NET Core does not support versioning at all.
NEXT				
C#	The 'Software Engineer Interview - C#' game is designed to help you excel in C#-focused technical interviews. Master essential concepts and topics to boost your interview readiness!	Interview	interview_csharp	
Question	Correct Answer	Invalid Answer 1	Invalid Answer 2	Invalid Answer 3
What is a tuple in C#?	Immutable sequences.	Mutable sequences.	Collections of methods.	Used for parallel tasks.
What is the difference between value type and reference type?	Value types store data; reference types store a reference.	Value types store references; reference types store data.	Value types are for UI; reference types are for databases.	Both store data directly.
What are boxing and unboxing in C#?	Boxing converts a value type to a reference type; unboxing converts it back.	Boxing converts a reference type to a value type; unboxing converts it back.	Boxing is for exceptions; unboxing is for events.	Boxing is for strings; unboxing is for arithmetic.
What are nullable types in C#?	Allow value types to have a null value.	Allow reference types to have a default value.	Used for dynamic memory allocation.	Used for managing string data.
What are immutable types in C#?	Cannot be modified after creation.	Can be modified after creation.	Used for temporary data storage.	Support dynamic changes at runtime.
What is the role of security tokens in UI and API interaction?	Used for user authentication via HTTP headers.	Store user preferences in a session.	Manage database transactions.	Handle file uploads.
What is the Task Parallel Library (TPL) in C#?	Simplifies parallel programming in .NET.	Used for creating user interfaces.	Manages database connections.	Handles exception logging.
How is asynchronous programming handled in C#?	Async/await keywords optimize responsiveness.	Used for static memory allocation.	Manages file system operations.	Used for UI rendering.
When to use async vs sync in API design?	Async calls improve performance and responsiveness.	Async calls are always faster than sync calls.	Used only for file operations.	Interchangeable without impact.
What are best practices for using async/await in C#?	Use async I/O operations and ConfigureAwait(false) to avoid UI deadlocks.	Avoid using async/await for network operations.	Always use async/await for every method.	Use async/await only for file operations.
What are common security vulnerabilities in C# applications?	SQL injection and cross-site scripting.	Memory leaks and buffer overflows.	Network congestion and latency issues.	File system corruption and data loss.
How is sensitive data handled in C#?	Encrypted and transmitted over secure protocols.	Stored in plain text for easy access.	Ignored during processing.	Stored only in local files.
What is the difference between a namespace and an assembly in .NET?	Namespace organizes related types; assembly is a compiled unit.	Namespace is a compiled unit; assembly organizes related types.	Namespace and assembly are the same.	Namespace for UI; assembly for databases.
What are lambda expressions in C#?	Anonymous functions for concise operations.	Named methods for complex operations.	Used for exception handling.	Collections of classes.
What is LINQ in C#?	Provides SQL-like syntax for querying data sources.	Manages UI layouts.	Handles low-level memory operations.	Used for exception handling.
What are delegates and events in C#?	Function pointers; multicast delegates for observers.	Manages UI layouts; handles database connections.	Interchangeable terms.	Used for exception handling; file operations.
What is garbage collection in C#?	Automatically manages memory by collecting unused objects.	Manually manages memory by user intervention.	Organizes UI elements.	Handles file system operations.
What are attributes in C#?	Provide metadata about code elements.	Used for UI rendering.	Manages database transactions.	Used for exception handling.
What is reflection in C#?	Allows runtime inspection and manipulation of metadata, types, and objects.	Used for compiling code.	Manages UI layout rendering.	Handles network communication.
What is the dynamic keyword in C#?	Allows late binding and dynamic typing.	Used for static type checking.	Manages UI elements.	Handles file operations.
What are extension methods in C#?	Add new methods to existing types without modifying them.	Replace existing methods in types.	Manages database connections.	Handles network operations.
What is dependency injection in C#?	Promotes loose coupling by injecting dependencies into classes.	Used for creating tight coupling.	Manages UI layouts.	Handles file system operations.
What is Entity Framework in C#?	ORM simplifies database interactions with C# objects.	Manages UI components.	Handles memory allocation.	Manages network communication.
What are caching mechanisms in C#?	Include in-memory, distributed, and output caching to improve performance.	Manages UI components.	Handles file storage.	Logs exceptions.
How is inheritance implemented in C#?	Uses ":" to pass down features from one class to another.	Uses "=" for extending classes.	Handles database connections.	Used for memory allocation.
What is the difference between method overriding and overloading?	Overloading has multiple methods with the same name but different parameters; overriding provides a subclass method implementation.	Both are the same.	Used for exception handling; file operations.	UI elements; network communication.
What do public, static, and void mean in C#?	"public" makes methods accessible; "static" belongs to the class; "void" returns no value.	"public" makes methods private; "static" makes them instance-specific; "void" returns a value.	Used for UI elements; database connections; file operations.	Used interchangeably.
What is an object in OOP?	Represents real-life entities with state, behavior, and identity.	Method for managing memory.	Handles UI rendering.	Static data structure.
What is the difference between arrays and ArrayLists in C#?	Arrays have a fixed size; ArrayLists dynamically resize.	Dynamically resize; fixed size.	Both are the same.	Handles file storage; network communication.
What is the difference between System.String and System.Text.StringBuilder?	String is immutable; StringBuilder is mutable and efficient for dynamic string manipulations.	Both are the same.	Mutable; immutable.	Handles UI rendering; file operations.
What is the difference between "throw" and "throw ex" in C#?	"throw" preserves call stack; "throw ex" resets it, affecting debugging.	Both are the same.	Handles file operations; memory management.	UI elements; network communication.
What are the responsibilities of the CLR in C#?	Manages memory, executes code, enforces security, ensures type safety, and supports debugging.	Only memory management.	Handles UI rendering.	Handles file operations.
NEXT				
SQL	The 'Software Engineer Interview - SQL' game is tailored to enhance your skills for SQL-focused technical interviews. Dive into essential SQL concepts and queries to boost your interview preparation!	Interview	interview_sql	
Question	Correct Answer	Invalid Answer 1	Invalid Answer 2	Invalid Answer 3
What is a view in SQL, and what are its benefits?	A saved query acting as a virtual table, enhancing data simplicity and security.	A view is a stored procedure for calculations.	A view is a temporary table for session data.	A view is an index for speeding up queries.
How does a JOIN operation work in SQL?	Combines data from two or more tables based on related columns.	A JOIN merges columns from tables.	A JOIN splits a table into parts.	A JOIN deletes rows from tables.
What is the purpose of an INNER JOIN in SQL?	Retrieves matching rows from both tables based on a condition.	An INNER JOIN retrieves all rows from tables.	An INNER JOIN retrieves rows from the first table.	An INNER JOIN retrieves rows from the second table.
How does a LEFT JOIN differ from other JOINs in SQL?	Retrieves all rows from the left table and matching rows from the right, including NULLs for non-matches.	A LEFT JOIN retrieves rows that match in both tables.	A LEFT JOIN retrieves all rows from the right table.	A LEFT JOIN retrieves rows from tables without conditions.
What does a RIGHT JOIN operation do in SQL?	Retrieves all rows from the right table and matching rows from the left, including NULLs for non-matches.	A RIGHT JOIN retrieves rows that match in both tables.	A RIGHT JOIN retrieves all rows from the left table.	A RIGHT JOIN retrieves rows from tables without conditions.
What is a FULL OUTER JOIN in SQL, and when is it used?	Retrieves all rows with matches in either table, including NULLs for non-matches.	A FULL OUTER JOIN retrieves matching rows from both tables.	A FULL OUTER JOIN retrieves only the non-matching rows.	A FULL OUTER JOIN retrieves all rows from both tables.
How do indexes improve query performance in a database?	Allows quick locating and retrieving of specific rows.	Indexes slow down query performance.	Indexes store data temporarily.	Indexes help in deleting rows faster.
What is the difference between a clustered and non-clustered index?	Clustered defines physical data order; non-clustered provides separate data structure for quick retrieval.	A clustered index is always faster.	A non-clustered index changes the physical order.	A non-clustered index is used only for sorting data.
What is the difference between UNION and UNION ALL?	UNION combines result sets and removes duplicates; UNION ALL includes duplicates.	UNION combines results without removing duplicates.	UNION ALL removes duplicates.	UNION ALL is used for sorting results.
What does a primary key do in a database?	Ensures each row is uniquely identified and disallows NULL values.	A primary key allows duplicate values.	A primary key can have multiple NULL values.	A primary key links tables together.
What is the purpose of a foreign key in a database?	Links tables via another table's primary key, maintaining referential integrity.	A foreign key is a unique identifier for each row.	A foreign key allows duplicate values.	A foreign key speeds up data retrieval.
What is the role of unique key constraints in a database?	Ensures values in a column are unique across the table, allowing one NULL value.	A unique key allows multiple duplicate values.	A unique key ensures all values are the same.	A unique key is used for linking tables.
What is a stored procedure (SP) in SQL?	Precompiled SQL statements executed on demand.	A stored procedure is a single SQL statement.	A stored procedure is used for creating indexes.	A stored procedure is only used for data insertion.
What is a function in SQL, and how is it used?	Returns a single value for computations, cannot update data.	A function performs data updates.	A function does not return any value.	A function is used for creating indexes.
How is the HAVING clause used in SQL?	Filters aggregate function results with the GROUP BY clause based on conditions.	The HAVING clause is used to sort data.	The HAVING clause is used to join tables.	The HAVING clause deletes rows based on conditions.
What is normalization in databases?	Organizing data to reduce redundancy and dependency, creating related tables.	Normalization combines all data into one table.	Normalization removes all indexes.	Normalization duplicates data across tables.
What is a trigger in SQL, and how is it used?	Instructions automatically executing on table or view events.	A trigger is used to manually update data.	A trigger is a type of index.	A trigger deletes rows from a table automatically.
What are the ACID properties in database transactions?	Ensures reliable transactions: Atomicity, Consistency, Isolation, Durability.	ACID properties are used for indexing data.	ACID properties enhance query performance.	ACID properties are used for data normalization.
What is SQL Profiler used for?	Monitors, analyzes, troubleshoots SQL Server activities.	SQL Profiler is used to update data.	SQL Profiler is used for data normalization.	SQL Profiler is used to delete rows.
What is a self-join in SQL?	Joins a table with itself, useful for hierarchical data or comparisons.	A self-join merges columns from different tables.	A self-join duplicates rows within a table.	A self-join deletes rows from a table.
What is the difference between DELETE and TRUNCATE in SQL?	DELETE removes rows based on conditions, can be rolled back; TRUNCATE removes all rows, resets identities, cannot be rolled back.	DELETE removes all rows without conditions.	TRUNCATE deletes specific rows based on conditions.	DELETE and TRUNCATE both remove rows permanently.
How is the GROUP BY clause used in SQL?	Groups rows with same values in specified columns, used with aggregate functions.	GROUP BY sorts data in ascending order.	GROUP BY filters rows based on conditions.	GROUP BY deletes duplicate rows.
How can you find the second highest value in a table?	Uses subquery with LIMIT and ORDER BY clauses.	Using a GROUP BY clause.	Using a HAVING clause.	Using an INDEX clause.
What is a correlated subquery in SQL?	Depends on outer query values, executed for each outer query row.	A correlated subquery runs independently of the outer query.	A correlated subquery updates data in the outer query.	A correlated subquery deletes rows based on conditions.
How is the CASE statement used in SQL?	Performs conditional logic in SELECT, WHERE, and ORDER BY clauses.	The CASE statement is used to join tables.	The CASE statement updates rows based on conditions.	The CASE statement deletes rows based on conditions.
What is a composite primary key in SQL?	Consists of multiple columns, uniquely identifying each row.	A composite primary key allows duplicate values.	A composite primary key can have NULL values.	A composite primary key is used for indexing.
How can you find duplicate records in a table?	Uses GROUP BY and HAVING clauses to filter groups with counts greater than one.	Using the DELETE statement.	Using the JOIN clause.	Using the INDEX clause.
What is a transaction in SQL, and what are its benefits?	Sequence of SQL statements executed as a single unit, ensures ACID properties.	A transaction updates rows in a table.	A transaction deletes rows from a table.	A transaction sorts data in a table.
How can you handle NULL values in SQL?	Uses IS NULL or IS NOT NULL operators to filter or check for NULL values.	Using the DELETE statement.	Using the JOIN clause.	Using the INDEX clause.
What is the SQL ROLLUP operator, and how is it used?	Creates subtotals and grand totals in result sets.	The SQL ROLLUP operator updates rows in a table.	The SQL ROLLUP operator deletes rows from a table.	The SQL ROLLUP operator sorts data in a table.
What is the SQL CUBE operator, and what does it do?	Generates all possible subtotals and grand totals in result sets.	The SQL CUBE operator updates rows in a table.	The SQL CUBE operator deletes rows from a table.	The SQL CUBE operator sorts data in a table.
What is the purpose of the MERGE statement in SQL?	Performs INSERT, UPDATE, or DELETE operations based on source and target tables.	The MERGE statement creates indexes.	The MERGE statement duplicates rows in a table.	The MERGE statement normalizes data in a table.
How is the SQL ROW_NUMBER() function used?	Assigns unique numbers to rows within result set partitions, often for pagination.	The SQL ROW_NUMBER() function updates rows in a table.	The SQL ROW_NUMBER() function deletes rows from a table.	The SQL ROW_NUMBER() function sorts data in a table.
What is a cursor in SQL, and when is it used?	Traverses result set rows, typically in stored procedures for row iteration.	A cursor updates rows in a table.	A cursor deletes rows from a table.	A cursor sorts data in a table.
NEXT				
Design pattern	The 'Software Engineer Interview - Design Patterns' game helps you master essential design patterns crucial for technical interviews. Explore key concepts and real-world examples to strengthen your skills!	Interview	interview_designpattern	
Question	Correct Answer	Invalid Answer 1	Invalid Answer 2	Invalid Answer 3
What is SOLID?	Set of design principles.	SOLID is a new programming language.	SOLID is used to design user interfaces.	SOLID is a database management tool.
What is the Single Responsibility Principle (SRP)?	One responsibility per class.	Ensures classes handle multiple responsibilities.	SRP allows classes to manage unrelated tasks.	Combines different functionalities in a single class.
What is the Open/Closed Principle (OCP)?	Open for extension, closed for modification.	OCP allows modifications to core functionality.	OCP is about making code easily modifiable.	OCP restricts any extensions to the code.
What is the Liskov Substitution Principle (LSP)?	Subclasses should be replaceable with base classes.	Allows subclasses to ignore base class contracts.	LSP is about creating unrelated subclasses.	Requires subclasses to be used only independently.
What is the Interface Segregation Principle (ISP)?	No client should depend on methods it does not use.	ISP promotes large, multi-purpose interfaces.	ISP combines multiple interfaces into one.	ISP ensures all clients use all methods.
What is the Dependency Inversion Principle (DIP)?	Depend on abstractions, not concrete implementations.	Makes low-level modules independent of high-level ones.	Focuses on making high-level modules depend on low-level modules.	Requires detailed dependencies between modules.
What are Abstract classes?	Classes with both abstract and concrete methods.	Used for defining common interfaces only.	Can inherit multiple concrete classes.	Handle different objects without common behavior.
What is Dependency Injection?	Providing dependencies externally.	Bundles data into microservices.	Manages object creation and composition internally.	Encapsulates data and methods into a class.
What is Compile-time vs Runtime Polymorphism?	Compile-time: method overloading; Runtime: method overriding.	Compile-time polymorphism is based on early binding.	Runtime polymorphism is decided at compile-time.	Compile-time polymorphism is based on the object type at runtime.
What is Encapsulation?	Bundling data and methods into a class.	Encapsulation exposes internal complexity.	Allows unrestricted access to class members.	Hides class members but does not bundle data and methods.
What are Microservices?	Breaking systems into smaller services.	Used for combining different services into one.	Handle a single large task as a whole.	Reduce dependencies within a single system.
What are Design Patterns?	Solutions for common design problems.	Structure object relationships without focusing on interactions.	Only control object creation.	Handle data storage and retrieval.
What is Polymorphism?	Performing actions on objects through a common interface.	Specifies data types as 'object' instead of specific types.	Using the same method name for different tasks.	Manages object interactions based on their type.
NEXT				
မြန်မာစကားပုံ - အပိုင်း (၁)/အခြေခံအဆင့်	မြန်မာစကားပုံနှင့် ဆိုရိုးစကား - အပိုင်း (၁)/အခြေခံအဆင့်။ စကားပုံဟူသည် လူအများ ဆင်ခြင်မှတ်သားဖွယ် ဖြစ်အောင် စံပြုပုံခိုင်းနှိုင်း ပြောဆိုလေ့ရှိကြတဲ့စကား၊ ပြောထုံးစကားမျိုး ဖြစ်ပါတယ်။	Riddle	riddle_1	
Question	Correct Answer	Invalid Answer 1	Invalid Answer 2	Invalid Answer 3
ကလေးရှက်တော့ငို	လူကြီးရှက်တော့ ရယ်	လူကြီးရှက်တော့ ငို	လူကြီးရှက်တော့ အို	လူကြီးရှက်တော့ အိပ်
ကုသိုလ်လည်းရ	ဝမ်းလည်းဝ	ပိုက်ဆံလည်းရ	အိပ်‌‌‌ရေးလည်းဝ	‌‌ပျော်လိုက်ရ
ကံထမ်းလာတာမမြင်ရ	လှံထမ်းလာတာသာမြင်ရ	ဆန် ထမ်းလာတာသာမြင်ရ	အောင်ပန်း ပြန်လာတာသာမြင်ရ	အိပ် နေတာသာမြင်ရ
ကံယုံ၍	ဆူးပုံမနင်းရာ	အီးပုံ မနင်းရာ	ထမင်းမစားရာ	ချဲမထိုးရာ
ကမ္ဘာမီးလောင်	သားကောင်ချနင်း	မီးသတ်အမြန်ခေါ်	၁၉၉ ဖုန်းဆက်	တီတီတောင်တောင်
ကိုယ်ထင်	ခုတင်ရွှေနန်း	ခုတင်မြနန်း	ခုတင်လွှတ်ကောင်း	ခုတင်ရွှေနန်း
ကိုယ်နှင့်နှိုင်း	မရိုင်း	ဆလိုင်း	ဘလိုင်း	တစ်အားရိုင်း
ကိုယ့်ပေါင်	ကိုယ်လှန်ထောင်း	ကိုယ်လှန်ကြည့်	ကိုယ်ကိုက်စား	ကိုယ်လျှာနဲ့လျှက်
ကြာကြာဝါးမည့်သွား	အရိုးကြည့်ရှောင်	အရိုးပဲဝါး	အသားပဲစား	အရွက်စား
ကြာကြာဝါးမှ	ခါးမှန်းသိ	သွားညောင်းအိ	ခါးတူးသည်	ဝါးဝါးကြာ
ကြီးသူကို ရိုသေ	ရွယ်တူကို လေးစား	ရွယ်တူကို ခေါင်းခေါက်	ရွယ်တူကို အာ၀ါးပေး	ရွယ်တူကို မွေးစား
ကြိုးစားက	ဘုရားဖြစ်	တစ်အားဖြစ်	ပန်းတိုင်ရောက်	အကျိုးရ
ကြက်ကန်း	ဆန်အိုးတိုး	အာရိုးရိုး	ဆန်အိုးမေ့	ဆန်အိုးချက်
ကျွဲပါး	စောင်းတီး	ဆောင်းကြည့်	မောင်းတီး	ဆောတီး
ကျွန်းကိုင်းမှီ	ကိုင်းကျွန်းမှီ	မှီကိုင်းကျွန်း	ကျွန်းမှီကိုင်း	အရမ်းကောင်းသည်
ခလုတ်ထိမှ	အမိတ	အဖတ	အမိုးတ	အိုမားတ
ခါချဉ်ကောင် မာန်ကြီးလို့	ခါးကမသန်	အားကအမှန်	အားကမသန်	သားက ဒလန်
တောင်ကြီးဖြိုမည့်ကြံ				
ချက်ဆို နားခွက်က	မီးတောက်	အီးပေါက်	ခရီးရောက်	တီးတောက်
ချစ်စကို ရှည်စေ	မုန်းစကို တိုစေ	မုန်းစကိုလည်း ရှည်စေ	အားလုံးကို တိုစေ	အရပ်လည်း ရှည်စေ
ခြောက်တိုင်းလည်း မကြောက်နှင့်	မြှောက်တိုင်းလည်းမမြာက်နှင့်	အခြောက်တိုင်းလည်း မကြောက်နှင့်	အမြှောက်တိုင်းလည်း မကြောက်နှင့်	လူတိုင်းလည်း မကြောက်နှင့်
NEXT				
မြန်မာစကားပုံ - အပိုင်း (၂)/အခြေခံအဆင့်	မြန်မာစကားပုံနှင့် ဆိုရိုးစကား - အပိုင်း (၂)/အခြေခံအဆင့်။ စကားပုံဟူသည် လူအများ ဆင်ခြင်မှတ်သားဖွယ် ဖြစ်အောင် စံပြုပုံခိုင်းနှိုင်း ပြောဆိုလေ့ရှိကြတဲ့စကား၊ ပြောထုံးစကားမျိုး ဖြစ်ပါတယ်။	Riddle	riddle_2	
Question	Correct Answer	Invalid Answer 1	Invalid Answer 2	Invalid Answer 3
ချွေတာစုဆောင်း	သူဌေးလောင်း	မုန့်ဆိမ်းပေါင်း	ဘုရင်လောင်း	သူကြီးလောင်း
ငါးကြင်းဆီနှင့်	ငါးကြင်းကြော်	ငါးကြင်းလှော်	ငါးကြင်းပြုတ်	ငါးကြင်းချက်
ငါးခုံးမတစ်ကောင်ကြောင့်	တစ်လှေလုံးပုပ်	တစ်လှေလုံးမြုပ်	တစ်လှေရှုပ်	တစ်လှေလုံး အိုကေ
ငါးစိမ်းမြင်	ငါးကင်ပစ်	ငါးကင်စား	ငါးသံပရာပေါင်း	ငါးကင်ရောင်း
ငှက်မသိက ဆက်ရက်ကို ချိုးထင်၊ အချက်မသိက	သမက်ကို သူခိုးထင်	လူတိုင်းကို သူခိုးထင်	သူစိမ်းကို သူခိုးထင်	ဘေးအိမ် သူခိုးထင်
ဆရာမပြ	နည်းမကျ	တပည့် မမြင်ရ	အာလူးမ	အိမ်စာမရ
ဆင်ဖိုးထက်	ချွန်းဖိုးကြီး	မြင်းဖိုးကြီး	ဆင်ဖွားကြီး	ကားဖိုးကြီး
တော်သလင်းနေ	ပုစွန်သေ	ရေဘ၀ဲသေ	၀ေလေလေ	ငါးခြောက်လေ
တောမီးလောင်	တောကြောင် လက်ခမောင်းခတ်	တောကြောင်ထက	တောကြောင် ပြာရာခက်	တောကြောင် အူလည်လည်
တစ်ခါသေဖူး	ပျဉ်ဖိုးနားလည်	ကားဖိုးနားလည်	အမျိုးအကြောင်းနားလည်	လူတွေအကြောင်းနားလည်
တစ်ချက်ခုတ်	နှစ်ချက်ပြတ်	သုံးချက်ပြတ်	တစ်ချက်ပြတ်	လေးငါးချက်ပြတ်
တစ်ဆိတ်	တစ်အိတ်လုပ်	နှစ်အိတ်လုပ်	သုံးအိတ်လုပ်	လေးအိတ်လုပ်
တစ်ရွာမပြောင်း	သူကောင်းမဖြစ်	ခရီးမရောက်	အလွန်ကောင်း	သူကြီးမဖြစ်
တစ်လုတ်စားဖူး	သူ့ကျေးဇူး	ဗိုက်တင်း	အလွန်ထူး	ရှယ်ကျေးဇူး
တိတ်တိတ်နေ	ထောင်တန်	ရာတန်	ကျပ်တန်	နားအေး
တန်ဆေး	လွန်ဘေး	လွန်ကောင်း	လွန်မူး	မှန်မှန်လေး
တိမ်မယောင်နှင့်နက်	လွယ်မယောင်နှင့်ခက်	အိမ်မှာတစ်ယောက်ထဲနှပ်	အိမ်သာလဲတက်	ပုထိန်ဆရာလဲခက်
ထမင်းအသက် ခုနှစ်ရက်	ရေအသက် တစ်မနက်	ရေအသက် နှစ်ရက်	ရေအသက် ခုနှစ်ရက်	ရေအသက် ဆယ်ရက်
ထန်းသီးကြွေခိုက်	ကျီးနင်းခိုက်	ကျီးပျံခိုက်	ကျီးငိုခိုက်	ကျီးနားခိုက်
ဒီယုန်မြင်လို့	ဒီချုံထွင်	ဒီစတိုင်ထွင်	ဒီပုံထွင်	ဒီယုန်ကင်

`;

export default CreateGameByExcelScreen;