export default async function handler(req, res) {
    const url =
        "https://tanrend.elte.hu/tanrendnavigation.php?" +
        req.url.split("?")[1];
    const response = await fetch(url);
    const text = await response.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(text);
}
