const ticktick = require('ticktick-wrapper');
const auth = require('ticktick-wrapper/src/auth');
const tickTick = require('ticktick-wrapper/src/ticktick');

const daysBeetwenDates = function(a, b) {
    const result = Math.round((a - b) / (1000 * 3600 * 24))
    return result
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const main = async() => {
    let login;
    let password;

    readline.question('Please enter login\n', input => {
        login = input;
        readline.question('Please enter password\n', input => {
            password = input;
            readline.close();
            printResultForUser(login, password)
        });
    });


};

const printResultForUser = async(login, password) => {

    await ticktick.login({
        email: {
            username: login,
            password: password,
        },
    });

    const tasks = await ticktick.tasks.getUncompleted()

    tasks.sort(function(a, b) {
        const firstDate = new Date(a.createdAt);
        const secondDate = new Date(b.createdAt);
        return firstDate - secondDate;
    });
    const currentDate = new Date()

    const filteredTasks = tasks.filter((value) => {
        let result = ((typeof value.tags == 'undefined') || !(value.tags.includes('повторяющееся'))) && (typeof value.dueDate == 'undefined')
        return result
    })

    const valuesOfTasks = filteredTasks.map((value) => daysBeetwenDates(currentDate, new Date(value.createdAt)))

    console.log("Значение метрики задачедней")
    console.log(
        valuesOfTasks.reduce((a, b) => a + b, 0)
    );

    console.log("Top-10 дорогостоящиx задач")
    filteredTasks.slice(0, 10).forEach(
        (item, index) => {
            console.log(item.title)
            console.log(valuesOfTasks[index])
        }
    )

    await tickTick.logout();
}

main();