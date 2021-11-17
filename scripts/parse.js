// 1. Go to https://www.facebook.com/akrolsmir/friends and save the html
// 2. Run this script to extract profile photos and names of friends

const fs = require('fs')
const JSSoup = require('jssoup').default

const data = fs.readFileSync('../public/dump/austin-friends-dump.html', 'utf8')

const soup = new JSSoup(data)
const grandparent = soup.find('div', {
  class: ['dati1w0a', 'ihqw7lf3', 'hv4rvrfc', 'discj3wi'],
})
const parent = grandparent.find('div', {
  class: ['j83agx80', 'btwxx1t3', 'lhclo0ds', 'i1fnvgqd'],
})
const children = parent.contents
let output = 'const profiles = [\n'
for (const child of children) {
  try {
    const imageUrl = child.find('img').attrs.src
    const name = child.find('span', {
      class: ['d2edcug0', 'hpfvmrgz', 'qv66sw1b', 'c1et5uql'],
    }).text
    output += `['${name}', '${imageUrl}'],\n`
  } catch (e) {
    console.warn(e)
    console.warn(child.toString())
  }
}
output += ']\n'

fs.writeFileSync('../public/dump/output.js', output)
