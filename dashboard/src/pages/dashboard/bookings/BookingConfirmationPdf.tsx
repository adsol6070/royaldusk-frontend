import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { BookingDetail } from "@/api/bookings/bookingTypes";
import Logo from "@/assets/images/rdusk-logo.png";
import LatoRegular from "@/assets/fonts/Lato-Regular.ttf";
import LatoBold from "@/assets/fonts/Lato-Bold.ttf";

Font.register({ family: "Lato-Regular", src: LatoRegular });
Font.register({ family: "Lato-Bold", src: LatoBold });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Lato-Regular",
    fontSize: 12,
    color: "#2f3640",
  },
  header: {
    borderBottom: "2 solid #dcdde1",
    marginBottom: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    height: 40,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 14,
    fontFamily: "Lato-Bold",
    color: "#0a3d62",
    marginBottom: 8,
    textTransform: "uppercase",
    borderBottom: "1 solid #dcdde1",
    paddingBottom: 4,
  },
  headingText: {
    fontSize: 16,
    fontFamily: "Lato-Bold",
    marginBottom: 4,
    color: "#1e272e",
  },

  metaText: {
    fontSize: 10,
    fontFamily: "Lato-Regular",
    color: "#636e72",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 120,
    fontFamily: "Lato-Bold",
    color: "#353b48",
  },
  value: {
    flex: 1,
    fontFamily: "Lato-Regular",
    color: "#2f3640",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    color: "#999",
    borderTop: "1 solid #ccc",
    paddingTop: 10,
  },
});

export const BookingConfirmationPdf = ({
  booking,
}: {
  booking: BookingDetail;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src={Logo} />
        <View>
          <Text style={styles.headingText}>Booking Confirmation</Text>
          <Text style={styles.metaText}>
            Invoice #:{" "}
            {booking.invoiceNumber || booking.id.slice(0, 8).toUpperCase()}
          </Text>
          <Text style={styles.metaText}>GSTR No: 07ABCDE1234F1Z5</Text>
          <Text style={styles.metaText}>
            Invoice Date: {new Date(booking.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Guest Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Booking ID:</Text>
          <Text style={styles.value}>{booking.id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{booking.guestName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{booking.guestEmail}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile:</Text>
          <Text style={styles.value}>{booking.guestMobile}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nationality:</Text>
          <Text style={styles.value}>{booking.guestNationality}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{booking.status}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Booked On:</Text>
          <Text style={styles.value}>
            {new Date(booking.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Package Details</Text>
        {booking.items.map((item, i) => (
          <View key={i}>
            <View style={styles.row}>
              <Text style={styles.label}>Package:</Text>
              <Text style={styles.value}>{item.packageName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Travelers:</Text>
              <Text style={styles.value}>{item.travelers}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Travel Date:</Text>
              <Text style={styles.value}>
                {new Date(item.startDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Payment Information</Text>
        {booking.payments.map((p, i) => (
          <View key={i}>
            <View style={styles.row}>
              <Text style={styles.label}>Provider:</Text>
              <Text style={styles.value}>{p.provider}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.value}>
                {p.currency.toUpperCase()} {(p.amount / 100).toFixed(2)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Card:</Text>
              <Text style={styles.value}>
                {p.cardBrand} **** {p.cardLast4}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>
                {new Date(p.createdAt).toLocaleString()}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{p.status}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={{ fontSize: 10, color: "#999" }}>
          This is a system-generated document. For any assistance, contact
          support@royaldusk.com
        </Text>
      </View>
    </Page>
  </Document>
);
