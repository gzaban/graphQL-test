# GraphQL

Hi! I'm your first Markdown file in **StackEdit**. If you want to learn about StackEdit, you can read me. If you want to play with Markdown, you can edit me. If you have finished with me, you can just create new files by opening the **file explorer** on the left corner of the navigation bar.


# How to run
first install all the dependencies

    npm run install

in 2 different console run this commands

    npm run server
    npm run dev

Open this url
http://localhost:4000/graphql

and start play

examples query

```javascript
{
  vars {
    id
    name
    accounts {
      id
      name
      var {
        id
        accounts{
          name
        }
      }
    }
  }
}
```

```javascript
{
  facility (id:"27") {
    name
    accounts{
      name
      var{
        name
      }
    }
  }
}
```
