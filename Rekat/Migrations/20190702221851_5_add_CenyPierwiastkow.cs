using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Rekat.Migrations
{
    public partial class _5_add_CenyPierwiastkow : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CenyPierwiastkow",
                columns: table => new
                {
                    PriceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PalladPrice = table.Column<double>(nullable: false),
                    RodPrice = table.Column<double>(nullable: false),
                    PlatynaPrice = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CenyPierwiastkow", x => x.PriceId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CenyPierwiastkow");
        }
    }
}
