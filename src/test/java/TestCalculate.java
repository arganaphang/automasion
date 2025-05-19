import com.github.arganaphang.Calculate;
import org.testng.Assert;
import org.testng.annotations.Test;

public class TestCalculate {

    @Test(testName = "Test Sum 2 Number")
    public void TestAdd() {
        Calculate cal = new Calculate();
        Assert.assertEquals(cal.add(3, 3), 6);
    }
}
