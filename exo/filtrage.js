// Format de date : YYYY-MM-DD

const articles = [
    {
        title: "The Rise of JavaScript",
        content: "JavaScript has become one of the most popular programming languages in the world...",
        author: "Jane Doe",
        date: "2023-10-01",
        category: "Programming"
    },
    {
        title: "Understanding Asynchronous Programming",
        content: "Asynchronous programming is a key concept in modern web development...",
        author: "John Smith",
        date: "2023-09-15",
        category: "Web Development"
    },
    {
        title: "A Guide to Node.js",
        content: "Node.js is a powerful tool for building server-side applications...",
        author: "Alice Johnson",
        date: "2023-08-20",
        category: "Backend"
    },
    {
        title: "Exploring the Frontend Frameworks",
        content: "Frontend frameworks like React, Angular, and Vue.js have revolutionized web development...",
        author: "Bob Brown",
        date: "2023-07-30",
        category: "Frontend"
    },
    {
        title: "The Future of Web Development",
        content: "With the rapid evolution of web technologies, the future of web development looks promising...",
        author: "Charlie Green",
        date: "2023-06-25",
        category: "Technology"
    }
];


var date = {
     startDate : "2023-06-26",
     endDate : "2023-08-21"
}


function filtrer_categorie(articles, categorie) {
    let filtrage_resultat = [];
    for (let i = 0; i < articles.length; i++) {
        if (categorie === articles[i].category) {
            filtrage_resultat.push(articles[i]);
        }
    }
    console.log("[FILTRER_CATEGORIE]",filtrage_resultat,"=====================FIN [FILTRER_CATEGORIE]");
    return filtrage_resultat;
}

filtrer_categorie(articles, "Web Development")

function filtrer_date(articles, fourchette_date){
    let filtrage_resultat = [];
    for (let i =0; i < articles.length; i++){
        if (articles[i].date > fourchette_date.startDate && articles[i].date < fourchette_date.endDate){
            filtrage_resultat.push(articles[i])
        }
    }
    console.log("[FILTRER_DATE]",filtrage_resultat, "======================= FIN [FILTRER_DATE]")
    return filtrage_resultat;
}
filtrer_date(articles, date)