import * as csv from 'fast-csv';

export async function csvToArray(createReadStream: any): Promise<Object[]> {
  return new Promise((resolve, reject) => {
    const res = [];
    createReadStream()
      .pipe(csv.parse({ delimiter: ',', headers: true, ltrim: true, rtrim: true }))
      .on('error', error => reject(error))
      .on('data', row => {
        res.push(row);
      })
      .on('end', () => resolve(res));
  });
}
