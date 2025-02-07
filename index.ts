type LP = {
    name: string,
    money: number
}

type Startup = {
    name: string,
    fundingNeeded: number,
    funded: number,
    lpFunding: {
        lp: LP,
        funding: number
    }[]
}

function generateFunding(startups: Startup[], lps: LP[]) {
    startups.forEach(startup => {
        lps.some(lp => {
            const neededFundingRemaining = startup.fundingNeeded - startup.funded
            if(lp.money > neededFundingRemaining) {
                // LP has enough to fulfill entire neededFundingRemaining
                startup.funded += neededFundingRemaining
                lp.money -= neededFundingRemaining
                
                startup.lpFunding.push({lp: lp, funding: neededFundingRemaining})

                return true //Startup in fully funded, break out of lps loop
            } else if (lp.money > 0) {
                // LP can't fulfill entire neededFundingRemaining but has some funds
                startup.funded += lp.money
                startup.lpFunding.push({lp: lp, funding: lp.money}) //Add amount
                lp.money = 0
            } else {
                // LP is has no funds, remove from lps array
                lps = lps.filter(lpItem => lpItem.name != lp.name)
            }
        })
    })
}

const startups: Startup[] = [
    { name: "amce", fundingNeeded: 100, funded: 0, lpFunding: [] },
    { name: "reddog", fundingNeeded: 90, funded: 0, lpFunding: [] },
    { name: "bluedog", fundingNeeded: 50, funded: 0, lpFunding: [] }
];
const lps: LP[] = [
    {name: "money_corp", money: 110},
    {name: "abc_corp", money: 20},
    { name: "xyz_corp", money: 200 }
]

generateFunding(startups, lps)

startups.forEach(startup => {
    console.log(startup.name + ' funded by: ' + JSON.stringify(startup.lpFunding.map(funding => funding.lp.name + ' -> ' + funding.funding)));
})
