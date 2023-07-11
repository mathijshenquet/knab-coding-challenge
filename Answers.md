
## 1. 
> How long did you spend on the coding assignment? What would you add to your solution if you had more time? If you didn't spend much time on the coding assignment then use this as an opportunity to explain what you would add

My rough time management looks like this:

5th July
11:45 - 12:00 request API key, set up project with typescript, express, dotenv, get to hello world
12:00 - 13:00 set up templating, make a template and make the main page
13:00 - 13:30 set up the email confirmation logic
14:30 - 15:30 writing the quoter 
18:00 - 19:30 finishing the quoter and writing the email update templates 

16th July 15:00 - 18:00 
Writing the schduler, writing tests, commenting code, refactoring for clarity 

17th July 22:00 - 24:00 
Finishing the code, making a readme, answering questions.md

I tried to add only features which I think would be neccissary for a MVP. These
include email confirmation and canceling, a simple templating system and basic
styling. I chose to leave some parts like the mailer as stubs (its just sends to 
stdout) as I think this is not the essential complexity of the project. The 
feature I would add next is some sort of persistance of both subscription data 
and the scheduler as now everything is stored in the emphemeral the process 
memory.

## Q2

> What was the most useful feature that was added to the latest version of your 
language of choice? Please include a snippet of code that shows how you've used 
it.

Typescript has a new keyword called `satisfies` used as `value satisfies type`.
It allows you to check that `value` can be typed as `type` without changing the
type of the resulting expression. This can be useful as this could otherwise
(https://www.typescriptlang.org/docs/handbook/2/narrowing.html)[narrow] the type 
of the value too much. 

As an example I used it in `src/currencies.ts` I've written:

```typescript
/** The record of supported crypto currencies */
export const CRYPTO_CURRENCIES = {
    BTC: {
        name: "Bitcoin",
        checked_by_default: true,
        fa_icon: "fa-bitcoin",
        slug: "bitcoin",
    },
    ETH: {
        name: "Ethereum",
        checked_by_default: false,
        fa_icon: "fa-ethereum",
        slug: "ethereum",
    },
} satisfies Record<string, CryptoCurrencyInfo>;
```

This way it is checked that eg `CRYPTO_CURRENCIES.BTC` is a `CryptoCurrencyInfo` 
without the type of `CRYPTO_CURRENCIES` collapsing to 
`Record<String, CryptoCurrencyInfo>`.

## Q3

> How would you track down a performance issue in production? Have you ever had 
to do this?

I would start by trying to reproduce the issue in a non-production environment, 
if possible. This would allow me to use profiling tools and other diagnostics 
without affecting users. If the issue can't be reproduced outside of production, 
I would look at logs and metrics to try to identify patterns or anomalies. 

I would also try to isolate the issue as much as possible. Is it related to a 
specific feature or functionality? Does it occur under certain conditions or at 
certain times? Is it affecting all users or only a subset? 

## Q4

> What was the latest technical book you have read or tech conference you have been to? What did you learn?

The latest conference I went to was Rust NL 2023. I learned about the dioxus 
a rust interface library from its author. It is very React like in design. 
I remember being very impressed by it especially how they managed to make hot 
reloading work with Rust.

## Q5 

> What do you think about this technical assessment?

I think it is nice. Maybe it would be more fun to answer these questions in 
person though.

## Q6

> Please, describe yourself using JSON.

Already did ;)
https://github.com/mathijshenquet/mathijshenquet.github.io/blob/master/src/cv/cv.json

