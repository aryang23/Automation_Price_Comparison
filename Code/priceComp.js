const puppeteer=require("puppeteer");
let links=["https://www.amazon.in/","https://www.flipkart.com/","https://paytm.com/"];
const PDFDocument = require('pdfkit');
const fs = require('fs');

let cTab;
let pName=process.argv[2];
// let pName="iPhone11";
(async function fn(){
    try
    {
        let browserOpenPromise=puppeteer.launch({
            headless:false,
            defaultViewport:null,
            args:["--start-maximized"],
            ignoreDefaultArgs: ['--disable-extensions']
        });
        let browser=await browserOpenPromise;
        let allTabsArr=await browser.pages();
        let pdfDoc = new PDFDocument;
        pdfDoc.pipe(fs.createWriteStream('SampleDocument.pdf'));
        cTab=allTabsArr[0];


        let list=await getListingFromAmazon(links[0],pName);
        console.log("*******************AMAZON**********************");
        console.table(list);
        pdfDoc.text(JSON.stringify(list));
        

        list=await getListingFromFlipkart(links[1],pName);
        console.log("*******************FLIPKART**********************");
        console.table(list);
        pdfDoc.text(JSON.stringify(list));

        list=await getListingFromPaytm(links[2],pName);
        console.log("*******************PAYTM**********************");
        console.table(list);
        pdfDoc.text(JSON.stringify(list));
        pdfDoc.end();
    }
    catch(err)
    {
        console.log(err);
    }
})();

async function getListingFromAmazon(link,pName)
{
    try
    {
        await cTab.goto(link);
        await cTab.type("#twotabsearchtextbox",pName,{delay:100});
        // console.log(1);
        await cTab.click("#nav-search-submit-button");
        // console.log(2);
        await cTab.waitForSelector(".a-section.a-spacing-small.a-spacing-top-small",{visible:true});
        // console.log(3);
        return cTab.evaluate(consoleFn,".a-size-medium.a-color-base.a-text-normal",".a-price-whole");
        // console.log(allPrices);
    }
    catch(err){
        console.log(err);
    }

}

async function getListingFromFlipkart(link,pName)
{
    try
    {
        await cTab.goto(link);
        await cTab.click("._2KpZ6l._2doB4z",{visible:true});
        await cTab.type("._3704LK",pName,{delay:100});
        await cTab.click(".L0Z3Pu",{visible:true});
        await cTab.waitForSelector("._10Ermr",{visible:true});
        return await cTab.evaluate(consoleFn,"._4rR01T","._30jeq3._1_WHN1");
        // return tb;
        // ._4rR01T
        // /._30jeq3._1_WHN1

    }
    catch(err)
    {
        console.log(err);
    }
}

async function getListingFromPaytm(link,pName)
{
    try
    {
        await cTab.goto(link);
        // await cTab.click("[type='search']");
        await cTab.type("[type='search']",pName,{delay:100});
        await cTab.keyboard.press("Enter");
        
        await cTab.waitForSelector("._3-is",{visible:true});
        // return await cTab.evaluate(consoleFn,".s1Q9rs","._30jeq3");
        return await cTab.evaluate(consoleFn,"._2apC","._1kMS");
        // console.table(tb);
    }
    catch(err)
    {
        console.log(err);
    }
}

function consoleFn(nameSelector,priceSelector)
{
    // console.log("hello");
    // console.log(typeof nameSelector);
    // console.log(priceSelector);
    let allNames=document.querySelectorAll(nameSelector);
    let allPrices=document.querySelectorAll(priceSelector);
    // console.log(allNames.length,allPrices.length);
    // console.log(allNames,allPrices);
    let stats=[];
    for(let i=0;i<5;i++)
    {
        if(allNames[i]&&allPrices[i]){
            let name=allNames[i].innerText;
            let price=allPrices[i].innerText;
            let obj={
                Name:name,
                Price:price
            }
            stats.push(obj);
        }
    }
    console.table(stats);
    return stats;
}



function consoleFnAmazon(blockSelector, sponsoredIdentifier, nameSelector, priceSelector) {
    // .s-include-content-margin.s-border-bottom.s-latency-cf-section .aok-inline-block.s-sponsored-label-info-icon
    // let nameElems = document.querySelectorAll(nameSelector);
    // let priceElems = document.querySelectorAll(priceSelector);
    // let listings = [];
    // for (let i = 0; i < 5; i++) {
    //     let name = nameElems[i].innerText;
    //     let price = priceElems[i].innerText;
    //     listings.push({
    //         name, price
    //     })
    // }
    // return listings;
    let allBlocks = document.querySelectorAll(blockSelector);
    let list = [];
    for (let i = 0; i < allBlocks.length; i++) {
        let isSponsored = allBlocks[i].querySelector(sponsoredIdentifier);
        if (isSponsored == null) {
            let nameElem = allBlocks[i].querySelector(nameSelector);
            let priceElem = allBlocks[i].querySelector(priceSelector);
            list.push({
                name: nameElem.innerText,
                price: priceElem.innerText
            }
            )
        }
        if (list.length == 5) {
            return list;
        }
    }
    return list;
}