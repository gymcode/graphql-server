const graphql = require('graphql');
const lodash = require('lodash');
const Author = require('../model/author');
const Book = require('../model/book');

const{ GraphQLObjectType, 
        GraphQLString, 
        GraphQLSchema, 
        GraphQLID, 
        GraphQLInt,
        GraphQLList,
        GraphQLNonNull
    } = graphql;
                                     

var books = [
    {
        name: 'Angel has fallen', 
        genre: "rock",
        id: "1",
        authorid: "1"
    }, 
    {
        name: 'the rock ', 
        genre: "hop",
        id: "2",
        authorid: "3"
    }, 
    {
        name: 'midnight decision', 
        genre: "high",
        id: "3",
        authorid: "2"
    },
    {
        name: 'my everything', 
        genre: "gosple",
        id: "4",
        authorid: "1"
    }, 
    {
        name: 'jason statham ', 
        genre: "hop",
        id: "5",
        authorid: "3"
    }, 
    {
        name: 'confetti', 
        genre: "nidenide",
        id: "6",
        authorid: "2"
    }
]


var author = [
    {
        name: 'Essel', 
        age: "24",
        id: "1",
        bookid: '1'
    }, 
    {
        name: 'Essuman', 
        age: "23",
        id: "2",
        bookid: "3"
    }, 
    {
        name: 'Kenneth', 
        age: "28",
        id: "3",
        bookid: "2"
    }
]

//define types and define realtionships 
//first object type
const BookType = new GraphQLObjectType ({
    name: 'Book', 
    fields: ()=>({
       id: {type: GraphQLID},
       name: {type: GraphQLString},
       genre: {type: GraphQLString},
       author: {
           type: AuthorTtype,
           resolve(parent, args){
            //    return lodash.find(author, {id : parent.authorid});
            return Author.findById(parent.authorid);
           }
       }
    })
})

const AuthorTtype = new GraphQLObjectType({
    name: 'Author', 
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        book: {
           type: new GraphQLList(BookType),
           resolve(parent, args){
            //    return lodash.filter(books, {authorid: parent.id})
            return Book.find({authorid: parent.id});
           }
        }
    })
})


//defining root queries this is how the use can jump into to the graph to grab data
const RootQuery = new GraphQLObjectType ({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: {type:GraphQLID}},
            resolve(parent, args){
                //code to get data from the database
                // return lodash.find(books, {id: args.id})
                return Book.findById({id: args.id})
            }
        },
        author: {
            type: AuthorTtype,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                // return lodash.find(author, {id: args.id})
                return Author.findById({id: args.id})
            }
        },
        book: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return 
                return Book.find()
            }
        },
        author: {
            type: new GraphQLList(AuthorTtype),
            resolve(parent, args){
                return Author.find()
            }
        }

    }
})

//helps us work in the database
const Mutation = new GraphQLObjectType({
    name: "Mutation", 
    fields: {
        addAuthor: {
            type: AuthorTtype, 
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)}, 
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let author =  new Author({
                    name: args.name,
                    age: args.age
                });
                try {
                    const savedUser = author.save()
                    return savedUser;
                } catch (error) {
                    console.log(error);
                }
            }
        },

        addBook: {
            type: BookType, 
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)}, 
                genre: {type: new GraphQLNonNull(GraphQLString)}, 
                authorid: {type: new GraphQLNonNull(GraphQLID)}
            }, 
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorid: args.authorid
                })
                try {
                    const savedBook = book.save()
                    return savedBook
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery, 
    mutation: Mutation
})