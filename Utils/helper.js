module.exports = {
    getPercentageData: (currentValue,previousValue) => {
        return (((currentValue - previousValue)/previousValue)*100).toFixed(1)
    },
    isPercentage : (clicksPercentage) => {
        return parseFloat(clicksPercentage) < parseFloat(0.0) ? false : true;
    },
    toAbsolute: (clicksPercentage) => {
        return parseFloat(clicksPercentage) < parseFloat(0.0) ? clicksPercentage*-1 : clicksPercentage; 
    },
    formatNumber : (currency,status) => {
        if(status)
        {
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              });
              return formatter.format(currency);
        }
        else {
            const formatter = new Intl.NumberFormat();
            return formatter.format(currency);
        }
    }
}