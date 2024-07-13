const { parse } = require('csv-parse');
const fs = require('fs');

const records = [];

function isPlanetHabitable(planet) {
    return planet['koi_disposition'] === "CONFIRMED"
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

fs.createReadStream('kepler_data.csv')
    .pipe(parse({
        comment: '#',
        columns: true
    }))
    .on('data', (data) => {
        // console.log(data['koi_disposition'], data['koi_insol'], data['koi_prad']);
        if(isPlanetHabitable(data)) {
            records.push(data);
        }
        // records.push(data)
    })
    .on('error', (err) => {
        console.log(err.message);
    })
    .on('end', () => {
        records.map((item) => {
            console.log([
                item['kepler_name'],
                item['koi_disposition'],
                item['koi_insol'],
                item['koi_prad'],
            ]);
        })
        console.log(`${records.length} habitable planets found!`);
        console.log("Done Reading!");
    });