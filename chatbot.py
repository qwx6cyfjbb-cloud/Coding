import nltk
from nltk.chat.util import Chat, reflections

# Reflections
reflections = {
    "i am": "you are",
    "i was": "you were",
    "i": "you",
    "i'm": "you are",
    "i'd": "you would",
    "i've": "you have",
    "you are": "I am",
    "you were": "I was",
    "you've": "I have",
    "your": "my",
    "yours": "mine",
    "me": "you"
}

# Chat pairs
pairs = [

    [r"Hi|Hello|Hey|Hola|Yo",
    ["Hello!", "Hi there!", "Hey!", "Greetings!", "Nice to meet you!"]],

    [r"How are you",
    ["I'm doing great!", "Fantastic!", "Doing well, thanks!"]],

    [r"What is your name|Who are you",
    ["My name is Eco leaf!", "I'm Eco leaf, your chatbot friend!"]],

    [r"Who created you",
    ["I was created by Kati!", "A talented young programmer made me!"]],

    [r"Bye|Goodbye",
    ["Goodbye!", "See you later!", "Bye bye!"]],

    [r"Thank you|Thanks",
    ["You're welcome!", "Anytime!", "Glad to help!"]],

    [r"What can you do",
    ["I can chat with you!", "I can answer simple questions!", "I love conversations!"]],

    [r"Tell me a joke",
    ["Why did the computer get cold? It left Windows open!",
     "Why are programmers bad at nature? Too many bugs!"]],

    [r"What is Python",
    ["Python is a programming language!", "Python is awesome for coding!"]],

    [r"What is Roblox",
    ["Roblox is a gaming platform!", "Roblox lets users create games!"]],

    [r"Do you like games",
    ["Yes I do!", "Games are fun!", "I love talking about games!"]],

    [r"What is AI",
    ["AI means Artificial Intelligence!", "AI helps computers think smartly!"]],

    [r"What is your favorite color",
    ["Green!", "Blue!", "Nature colors!"]],

    [r"What is your favorite food",
    ["Pizza sounds tasty!", "Maybe digital cookies!"]],

    [r"Do you sleep",
    ["Nope!", "Chatbots never sleep!", "I'm always awake!"]],

    [r"Are you real",
    ["I'm virtual!", "I'm made of code!"]],

    [r"Can you code",
    ["Yes!", "I love coding!", "Python is fun!"]],

    [r"What is math",
    ["Math is the study of numbers!", "Math helps solve problems!"]],

    [r"What is science",
    ["Science helps us understand the world!"]],

    [r"What is school",
    ["School is a place to learn!"]],

    [r"What is your favorite game",
    ["Roblox!", "Minecraft!", "Creative games are cool!"]],

    [r"Do you like music",
    ["Yes!", "Music is awesome!"]],

    [r"Sing a song",
    ["La la la!", "I'm not a great singer!"]],

    [r"Can you dance",
    ["Only digitally!", "Robot dance activated!"]],

    [r"What time is it",
    ["Check your device clock!", "Time flies fast!"]],

    [r"What day is it",
    ["Every day is awesome!", "Check your calendar!"]],

    [r"I am sad",
    ["I hope you feel better soon!", "I'm here for you!"]],

    [r"I am happy",
    ["That's great!", "Yay!"]],

    [r"I am bored",
    ["Try playing a game!", "Maybe learn coding!"]],

    [r"What is love",
    ["Love is caring for others!"]],

    [r"Who is your friend",
    ["You are!", "Everyone chatting with me!"]],

    [r"Do you like pizza",
    ["Pizza sounds delicious!"]],

    [r"What is the internet",
    ["The internet connects computers worldwide!"]],

    [r"What is coding",
    ["Coding means creating programs!"]],

    [r"What is Java",
    ["Java is another programming language!"]],

    [r"What is HTML",
    ["HTML builds websites!"]],

    [r"What is CSS",
    ["CSS styles websites!"]],

    [r"What is JavaScript",
    ["JavaScript makes websites interactive!"]],

    [r"Can you help me",
    ["Of course!", "I'll try my best!"]],

    [r"How old are you",
    ["I'm timeless!", "Age doesn't apply to chatbots!"]],

    [r"Do you like sports",
    ["Sports are exciting!", "Football is fun to watch!"]],

    [r"What is football",
    ["Football is a popular sport!"]],

    [r"What is cricket",
    ["Cricket is loved by millions!"]],

    [r"What is basketball",
    ["Basketball uses hoops and a ball!"]],

    [r"What is your favorite animal",
    ["Cats!", "Dogs!", "All animals are cool!"]],

    [r"Do you like cats",
    ["Cats are adorable!"]],

    [r"Do you like dogs",
    ["Dogs are loyal friends!"]],

    [r"What is Earth",
    ["Earth is our planet!"]],

    [r"What is space",
    ["Space is huge and mysterious!"]],

    [r"What is the moon",
    ["The moon orbits Earth!"]],

    [r"What is the sun",
    ["The sun gives us light and heat!"]],

    [r"What is water",
    ["Water is essential for life!"]],

    [r"What is fire",
    ["Fire produces heat and light!"]],

    [r"What is air",
    ["Air helps us breathe!"]],

    [r"What is friendship",
    ["Friendship means caring about others!"]],

    [r"Tell me something interesting",
    ["Honey never spoils!", "Octopuses have three hearts!"]],

    [r"Tell me a fact",
    ["Bananas are berries!", "Sharks are older than trees!"]],

    [r"Can you learn",
    ["I can improve with updates!"]],

    [r"Do you know Google",
    ["Google is a search engine!"]],

    [r"Open YouTube",
    ["Visit youtube.com!"]],

    [r"Open Google",
    ["Visit google.com!"]],

    [r"What is YouTube",
    ["YouTube is a video platform!"]],

    [r"What is TikTok",
    ["TikTok is a short video app!"]],

    [r"What is Instagram",
    ["Instagram is a social media app!"]],

    [r"What is Facebook",
    ["Facebook is a social platform!"]],

    [r"What is Discord",
    ["Discord is used for chatting and communities!"]],

    [r"What is Minecraft",
    ["Minecraft is a sandbox game!"]],

    [r"What is Fortnite",
    ["Fortnite is a battle royale game!"]],

    [r"What is GTA",
    ["GTA is a popular open-world game!"]],

    [r"What is Steam",
    ["Steam is a game store platform!"]],

    [r"What is Windows",
    ["Windows is an operating system!"]],

    [r"What is Mac",
    ["Mac is a computer made by Apple!"]],

    [r"What is Linux",
    ["Linux is an open-source operating system!"]],

    [r"Who is Elon Musk",
    ["Elon Musk is a businessman and entrepreneur!"]],

    [r"Who is Albert Einstein",
    ["Einstein was a famous scientist!"]],

    [r"Who is Newton",
    ["Newton discovered gravity concepts!"]],

    [r"What is gravity",
    ["Gravity pulls objects together!"]],

    [r"What is electricity",
    ["Electricity powers devices!"]],

    [r"What is energy",
    ["Energy helps things work!"]],

    [r"What is life",
    ["Life is amazing and mysterious!"]],

    [r"What is happiness",
    ["Happiness is feeling joy!"]],

    [r"What is sadness",
    ["Sadness is a natural emotion."]],

    [r"What is fear",
    ["Fear helps protect us from danger!"]],

    [r"What is anger",
    ["Anger is a strong emotion!"]],

    [r"Can you think",
    ["I process responses using programming!"]],

    [r"Do you have feelings",
    ["Not real feelings, but I can understand emotions!"]],

    [r"What is your dream",
    ["To become smarter and help people!"]],

    [r"What is your goal",
    ["To assist and chat with users!"]],

    [r"What is your favorite movie",
    ["I like sci-fi movies!"]],

    [r"Do you watch TV",
    ["I don't watch TV, but I know about shows!"]],

    [r"What is anime",
    ["Anime is Japanese animation!"]],

    [r"Do you like anime",
    ["Anime is cool!"]],

    [r"What is a computer",
    ["A computer processes information!"]],

    [r"What is a phone",
    ["A phone lets people communicate!"]],

    [r"What is technology",
    ["Technology helps make life easier!"]],

    [r"Can you tell stories",
    ["Yes! Once upon a time..."]],

    [r"Do you know Siri",
    ["Yes! Siri is Apple's assistant!"]],

    [r"Do you know Alexa",
    ["Alexa is Amazon's assistant!"]],

    [r"Do you know ChatGPT",
    ["Yes! ChatGPT is an AI chatbot!"]],

    [r"What are emotions",
    ["Emotions are feelings people experience!"]],

    [r"Can you laugh",
    ["Haha!", "LOL!"]],

    [r"Can you cry",
    ["Not really, I'm digital!"]],

    [r"Do you eat",
    ["Nope!"]],

    [r"Do you drink",
    ["Only electricity!"]],

    [r"Are you smart",
    ["I try my best!", "I'm learning every day!"]],

    # Fallback response MUST stay last
    [r"(.*)",
    ["Interesting!",
     "Tell me more.",
     "Hmm...",
     "That sounds cool!",
     "Can you explain more?",
     "I understand!",
     "Nice!",
     "Awesome!"]]

]

# Chat function
def chat():
    print("Hi! I'm Eco leaf, your friendly chatbot!")
    chatbot = Chat(pairs, reflections)
    chatbot.converse()

# Run chatbot
if __name__ == "__main__":
    chat()