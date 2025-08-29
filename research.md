# Сrawling ads.txt

## Request processing scenarios

- server error (HTTP 500)

- `ads.txt` not found (HTTP 404)

- SOFT 404. Examples: 
    - [Empty page](#empty-page)
    - [HTML page with 404 not found](#html-error-page)
    - [Redirect on main page HTTP 301/302](#redirect)
    - [CMS generate page](#cms)
    - [CDN or firewall block access to page](#blocked-access)

- `robot.txt` block `ads.txt` or CORS (HTTP 403)

- success retrive `ads.txt` with correct content

## Main report
```ts
    type Result = SuccessReport | FailureReport;
```
```json

    {
        "report": {
            "id": string,
            "timestamp": Date,
            "total_requests": number,
            "successful": number,
            "failed": number,
            "results": Result[]
        }
    }
```

## Success report
```ts
    type Relation = "RESELLER" | "DIRECT";
    type ContentType = "text/html" | "application/json"; //add more
```
```json
    {
        "success": {
            "id": string,
            "timestamp": Date,
            "parse_params": {
                "url": string,
                "ads_domains": string[]
            },
            "http": {
                "status_code": number,
                "status_text": string,
                "headers": {
                    "content_type": ContentType,
                    "content_length": string // or number
                },
                "response_time_ms": number
            },
            "response_content": {
                "records_count": number,
                "list": string[], //if need to see all domains in ads.txt
                "matches": {
                    "domain": string,
                    "exist": boolean,
                    "relationship_type": Relation,
                    "publisher_id": string, 
                    "tag_id": string, //if exist
                }[],
            }
        }
    }
```




## Failure report
```json
    {
        "failure": {
            "id": string,
            "timestamp": Date,
            "parse_params": {
                "url": string,
                "adsDomains": string[]
            },
            "error": {
                "http_code": number,
                "type": string,
                "raw_response": string
            }
        }
    }
```




## Examples

### Empty page
```text
    HTTP/1.1 200 OK
    Date: Thu, 28 Aug 2025 13:00:00 GMT
    Server: Apache/2.4.41
    Content-Type: text/plain
    Content-Length: 0
    Cache-Control: no-cache
```

### HTML error page
```text
    HTTP/1.1 200 OK
    Date: Thu, 28 Aug 2025 13:00:00 GMT
    Server: nginx/1.18.0
    Content-Type: text/html; charset=UTF-8
    Content-Length: 1247
    Cache-Control: max-age=3600

    <!DOCTYPE html>
    <html>
    <head>
        <title>Page Not Found</title>
    </head>
    <body>
        <h1>404 - File Not Found</h1>
        <p>The requested file /ads.txt could not be found on this server.</p>
        <p><a href="/">Return to homepage</a></p>
    </body>
    </html>
```

### Redirect
```text
    HTTP/1.1 200 OK
    Date: Thu, 28 Aug 2025 13:00:00 GMT
    Server: Apache/2.4.41
    Content-Type: text/html; charset=UTF-8
    Content-Length: 5420
    Location: https://example.com/

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Welcome to Example.com</title>
    </head>
    <body>
        <header>
            <h1>Welcome to our website</h1>
        </header>
        <main>
            <p>This is our homepage content...</p>
        </main>
    </body>
    </html>
```

### CMS
```text
    HTTP/1.1 200 OK
    Date: Thu, 28 Aug 2025 13:00:00 GMT
    Server: nginx/1.18.0
    Content-Type: text/html; charset=UTF-8
    Content-Length: 892
    X-Powered-By: WordPress

    <!DOCTYPE html>
    <html>
    <head>
        <title>File not available | Example Blog</title>
        <meta name="robots" content="noindex, nofollow">
    </head>
    <body>
        <div class="error-container">
            <h2>Sorry, this file is not available</h2>
            <p>The ads.txt file you're looking for doesn't exist.</p>
            <p>Please contact the administrator if you believe this is an error.</p>
        </div>
    </body>
    </html>
```

### Blocked access
```text
HTTP/1.1 200 OK
Date: Thu, 28 Aug 2025 13:00:00 GMT
Server: cloudflare
Content-Type: text/plain
Content-Length: 43
CF-Cache-Status: MISS

Access to this resource has been blocked.
```

## Input structure
Create a `domains.json` file in root directory with the following structure:
- `search_params` and `domain_list` must be arrays 
- type of array values - string

```json

    {
        "search_params": [ "test1", "test2" ],
        "domain_list": [
            "example1.com",
            "example2.com",
            "example3.com",
            "example4.com",
        ]
    }

```