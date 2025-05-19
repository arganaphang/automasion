import org.json.JSONObject;
import org.testng.annotations.Test;

import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

public class TestCategory {
    public static String HOST = "http://localhost:8080";

    @Test(testName = "Get All Categories")
    public void getAllCategories() {
        given().when().get(HOST + "/api/v1/categories").then().assertThat().statusCode(200).body("success", equalTo(true));
    }

    @Test(testName = "Add New Category")
    public void addNewCategory() {
        String newName = UUID.randomUUID().toString();
        JSONObject newCategory = new JSONObject();
        newCategory.put("name", newName);
        given().body(newCategory.toString()).contentType("application/json").when().post(HOST + "/api/v1/categories").then().assertThat().statusCode(201).body("success", equalTo(true));

        given().when().get(HOST + "/api/v1/categories").then().assertThat().statusCode(200).body("success", equalTo(true)).body("data", hasItem(allOf(hasEntry("name", newName))));
    }
}
