const userTypeDefs = `#graphql

type User  {
_id: ID! 
username: String!
name: String!
password: String!
profilePicture: String
gender: String!

}

type Query {
    users: [User!]
    authuser: User
    user(userId:ID!) : User
    
    }

    type Mutation {
        singUp(input:SingUpInput!) : User
        login(input:LoginInput!) : User
         logout: LogoutResponse
    }

input  SingUpInput {
username:String!
name:String!
password:String!
gender:String!
}


input LoginInput {
username:String!
password:String!
}


type LogoutResponse {
    message:String!
}

`;

export default userTypeDefs;
