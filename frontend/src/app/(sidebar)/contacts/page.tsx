import { ContactForm } from "@/components/ContactForm";
import { Address } from "@/components/geo/Address";
import { Map } from "@/components/geo/Map";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import contacts from "@/contacts.json";
import { Building, Clock, Mail, MapPin, MessageSquare, Phone } from "lucide-react";

export default function ContactsPage() {
  return (
    <div className="flex-1">
      <h1 className="text-2xl font-bold mb-6">Контакты</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                Наши офисы
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Главный офис</h3>
                    <p className="text-gray-600">
                      {contacts.address.Астана}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Филиал</h3>
                    <p className="text-gray-600">
                      <Address />
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                Свяжитесь с нами
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="text-gray-600">{contacts.phone.text}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="text-gray-600">{contacts.email.info}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="text-gray-600">Пн-Пт: 9:00 - 18:00</p>
                    <p className="text-gray-600">Сб: 9:00 - 14:00, Вс: выходной</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Реквизиты</h2>
            <Table className="border-collapse border border-gray-300">
              <TableBody>
                <TableRow>
                  <TableCell>Полное наименование</TableCell>
                <TableCell>ТОО &quot;KAZMETALCORD&quot;</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ИИН/БИН</TableCell>
                <TableCell>240340004110</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ИИК</TableCell>
                <TableCell>
                  KZ908562203136526437 KZT <br /> KZ028562203336909263 RUB
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Наименование Банка</TableCell>
                <TableCell>АО &quot;Банк ЦентрКредит&quot;</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>БСК/БИК (SWIFT)</TableCell>
                <TableCell>KCJBKZKX</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Свидетельство</TableCell>
                <TableCell>серия 62001 № 1048842 от 05 марта 2024 года</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Руководитель</TableCell>
                <TableCell>ТОЙБАЗАРОВА САҒИРА СЕРІКҚЫЗЫ</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Юр адрес</TableCell>
                <TableCell>г.Астана, район Нура, улица Култегин, дом 19/1, кв. 362</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Напишите нам</h2>
              <ContactForm />
            </CardContent>
          </Card>

          {/* Map Section */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Как нас найти</h2>
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                <Map />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
