const transactionTypeDef = `#graphql


type Transaction {
_id:ID!
userId:String!
paymentType:String!
description:String!
category:String!
amount:Float!
date:String!
location:String
}

type Query {

    transactions:[Transaction!]
transaction(transactionId:ID!):Transaction

}

type Mutation {
 createTransaction(input: CreateTransactionInput!):Transaction!
 updateTransaction(input: UpdateTransactionInput!):Transaction!
 deleteTransaction(transactionId:ID!): Transaction!
}


input  CreateTransactionInput {
paymentType:String!
description:String!
category:String!
amount:Float!
date:String!
location:String
}


input UpdateTransactionInput{
transactionId:ID!
paymentType:String
description:String
category:String
amount:Float
date:String
location:String
}

`;

export default transactionTypeDef;
