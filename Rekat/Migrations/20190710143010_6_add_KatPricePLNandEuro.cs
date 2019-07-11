using Microsoft.EntityFrameworkCore.Migrations;

namespace Rekat.Migrations
{
    public partial class _6_add_KatPricePLNandEuro : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "KatPricePLN",
                table: "Products",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "EuroExchangeRate",
                table: "CenyPierwiastkow",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KatPricePLN",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "EuroExchangeRate",
                table: "CenyPierwiastkow");
        }
    }
}
