import { Button } from "@mantine/core";

function Donate() {
  return (
    <form action="https://www.paypal.com/donate" method="post" target="_top">
      <input type="hidden" name="hosted_button_id" value="HML39Z8NQNB4C" />

      <Button
        type="submit"
        name="submit"
        title="PayPal - The safer, easier way to pay online!"
        variant="outline"
        radius={99}
      >
        Donate a coffee ☕️
      </Button>

      <img
        alt=""
        src="https://www.paypal.com/en_IT/i/scr/pixel.gif"
        width="1"
        height="1"
      />
    </form>
  );
}

export default Donate;
