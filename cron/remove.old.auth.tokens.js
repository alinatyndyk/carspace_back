const {authService} = require('../services');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

module.exports = () => {
    try{
        const oneMonthBeforeNow = dayjs().utc().add(-1, 'month');

        const userAuth =  authService.deleteManyByParams({
            createdAt: {$lte: oneMonthBeforeNow}
        })
        const companyAuth =  authService.deleteManyByParamsCompany({
            createdAt: {$lte: oneMonthBeforeNow}
        })
        return {userAuth, companyAuth}

    }catch (e){
        console.log(e);
    }
}