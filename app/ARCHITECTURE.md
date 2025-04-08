## ErDiagram

```mermaid
erDiagram
    CROSS_BREEDING_REQUEST {
        int id
        string askingUserId
        string askingCatId
        string askedUserId
        string askedCatId
        string status
    }
    
    CAT {
        uuid id
        string name
        int age
        string breedId
        timestamp created
        timestamp updated
        string color
        string userId
    }

    BREED {
        uuid id
        string name
        string description
        string seed
    }

    USER {
        uuid id
        string username
    }

    COMMENT {
        int id
        string content
        string catId
    }

    CAT ||--|{ COMMENT : has
    BREED ||--|{ CAT : has
    USER ||--|{ CAT : owns
    USER ||--|{ CROSS_BREEDING_REQUEST : asks
    CAT ||--|{ CROSS_BREEDING_REQUEST : involved
