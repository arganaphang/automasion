import org.testng.annotations.Test;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class TestHealthCheck {
    public static String HOST = "http://localhost:8080";

    @Test(testName = "Test Health Check Endpoint")
    public void testGetHealthCheck() {
        // 1. Get /healthz
        given()
                .when()
                .get(HOST + "/healthz").then().assertThat()
                // 2. Compare Status Code, must be 200
                .statusCode(200)
                // 3. Compare Response Body, success must be true, and message must be "OK"
                .body("success", equalTo(true)).body("message", equalTo("OK"));
    }
}
